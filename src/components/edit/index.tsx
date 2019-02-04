import React from 'react'
import MonacoEditor from 'react-monaco-editor'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { rootStateType } from '../../store'
import { loadContent } from '../../store/EditContent'
import Breadcrumbs from '../Breadcrumbs'

export const mapStateToProps = (state: rootStateType) => ({
  currentContent: state.editContent.currentContent,
  ancestors: state.editContent.ancestors,
})

export const mapDispatchToProps = {
  loadContent,
}

const EditComponent: React.FunctionComponent<
  RouteComponentProps<{ contentId?: string }> & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
> = props => {
  const contentId = parseInt(props.match.params.contentId as string, 10)
  props.loadContent(contentId)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '.3em 0' }}>
      <Breadcrumbs content={props.ancestors} currentContent={props.currentContent} />
      <MonacoEditor
        theme="vs-dark"
        width="100%"
        language="json"
        value={JSON.stringify(props.currentContent, undefined, 5)}
      />
    </div>
  )
}

const connectedComponent = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(EditComponent),
)

export default connectedComponent
