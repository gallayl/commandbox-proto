import React, { useContext } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { ContentContextProvider } from '../../services/ContentContextProvider'
import { rootStateType } from '../../store'
import { loadContent } from '../../store/EditContent'
import Breadcrumbs, { BreadcrumbItem } from '../Breadcrumbs'
import { FullScreenLoader } from '../FullScreenLoader'
import { InjectorContext } from '../InjectorContext'
import { TextEditor } from './TextEditor'

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
              url: injector.GetInstance(ContentContextProvider).getPrimaryActionUrl(content),
              content,
            } as BreadcrumbItem),
        )}
        currentContent={{
          displayName: props.currentContent.DisplayName || props.currentContent.Name,
          title: props.currentContent.Path,
          url: injector.GetInstance(ContentContextProvider).getPrimaryActionUrl(props.currentContent),
          content: props.currentContent,
        }}
      />
      {props.currentContent.Id ? <TextEditor content={props.currentContent} /> : <FullScreenLoader />}
      {/* {props.currentContent.Id === 0 ? null : props.currentContent.Type === 'ContentType' ? (
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
      )} */}
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
