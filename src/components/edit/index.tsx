import { Injector } from '@furystack/inject'
import { Settings } from '@sensenet/default-content-types'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { ContentRouteProvider } from '../../services/ContentRouteProvider'
import { rootStateType } from '../../store'
import { loadContent } from '../../store/EditContent'
import Breadcrumbs, { BreadcrumbItem } from '../Breadcrumbs'
import { withInjector } from '../withInjector'
import { ContentTypeEditor } from './ContentTypeEditor'
import JsonEditor from './JsonEditor'
import { SettingsEditor } from './SettingsEditor'

export const mapStateToProps = (state: rootStateType) => ({
  currentContent: state.editContent.currentContent,
  ancestors: state.editContent.ancestors,
  error: state.editContent.error,
})

export const mapDispatchToProps = {
  loadContent,
}

const Editor: React.FunctionComponent<
  ReturnType<typeof mapStateToProps> &
    typeof mapDispatchToProps &
    RouteComponentProps<{ contentId?: string }> & { injector: Injector }
> = props => {
  if (props.error) {
    throw props.error
  }

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
              url: props.injector.GetInstance(ContentRouteProvider).primaryAction(content),
              content,
            } as BreadcrumbItem),
        )}
        currentContent={{
          displayName: props.currentContent.DisplayName || props.currentContent.Name,
          title: props.currentContent.Path,
          url: props.injector.GetInstance(ContentRouteProvider).primaryAction(props.currentContent),
          content: props.currentContent,
        }}
      />
      {props.currentContent.Type === 'ContentType' ? (
        <ContentTypeEditor content={props.currentContent} />
      ) : props.currentContent.Type === 'Settings' || props.currentContent.Type === 'PortalSettings' ? (
        <SettingsEditor content={props.currentContent as Settings} />
      ) : (
        <JsonEditor value={JSON.stringify(props.currentContent, undefined, 5)} />
      )}
    </div>
  )
}

const connectedComponent = withInjector(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(Editor),
  ),
)
export default connectedComponent
