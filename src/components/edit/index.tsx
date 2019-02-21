import { Repository } from '@sensenet/client-core'
import { Settings } from '@sensenet/default-content-types'
import React, { useContext } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { ContentRouteProvider } from '../../services/ContentRouteProvider'
import { rootStateType } from '../../store'
import { loadContent } from '../../store/EditContent'
import Breadcrumbs, { BreadcrumbItem } from '../Breadcrumbs'
import { InjectorContext } from '../InjectorContext'
import { ContentTypeEditor } from './ContentTypeEditor'
import { CssEditor } from './CssEditor'
import { GenericContentEditor } from './GenericContentEditor'
import { JavaScriptEditor } from './JavaScriptEditor'
import { SettingsEditor } from './SettingsEditor'

const mapStateToProps = (state: rootStateType) => ({
  currentContent: state.editContent.currentContent,
  ancestors: state.editContent.ancestors,
  error: state.editContent.error,
})

export const mapDispatchToProps = {
  loadContent,
}

const Editor: React.FunctionComponent<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<{ contentId?: string }>
> = props => {
  if (props.error) {
    throw props.error
  }

  const injector = useContext(InjectorContext)

  const repo = injector.GetInstance(Repository)
  const schema = repo.schemas.getSchemaByName(props.currentContent.Type)

  const contentId = parseInt(props.match.params.contentId as string, 10)
  props.loadContent(contentId)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '.3em 0' }}>
      <Breadcrumbs
        onItemClick={(_ev, item) => {
          props.history.push(item.url)
        }}
        content={props.ancestors.map(
          content =>
            ({
              displayName: content.DisplayName || content.Name,
              title: content.Path,
              url: injector.GetInstance(ContentRouteProvider).primaryAction(content),
              content,
            } as BreadcrumbItem),
        )}
        currentContent={{
          displayName: props.currentContent.DisplayName || props.currentContent.Name,
          title: props.currentContent.Path,
          url: injector.GetInstance(ContentRouteProvider).primaryAction(props.currentContent),
          content: props.currentContent,
        }}
      />
      {props.currentContent.Id === 0 ? null : props.currentContent.Type === 'ContentType' ? (
        <ContentTypeEditor content={props.currentContent} />
      ) : props.currentContent.Type === 'Settings' || schema.ParentTypeName === 'Settings' ? (
        <SettingsEditor content={props.currentContent as Settings} />
      ) : (props.currentContent as any).IsFile ? (
        (props.currentContent as any).Binary &&
        (props.currentContent as any).Binary.__mediaresource.content_type === 'application/x-javascript' ? (
          <JavaScriptEditor content={props.currentContent} />
        ) : (props.currentContent as any).Binary &&
          (props.currentContent as any).Binary.__mediaresource.content_type === 'text/css' ? (
          <CssEditor content={props.currentContent} />
        ) : null
      ) : (
        <GenericContentEditor content={props.currentContent} />
      )}
    </div>
  )
}

const connectedComponent = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Editor),
)
export default connectedComponent
