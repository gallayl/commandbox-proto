import { Typography } from '@material-ui/core'
import React from 'react'
import MonacoEditor from 'react-monaco-editor'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { rootStateType } from '../../store'
import { loadContent } from '../../store/EditContent'

export const mapStateToProps = (state: rootStateType) => ({
  currentContent: state.editContent.currentContent,
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
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Typography variant="h5"> Edit Component </Typography>
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
