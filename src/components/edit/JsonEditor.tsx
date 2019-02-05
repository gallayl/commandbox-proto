import React from 'react'
import MonacoEditor from 'react-monaco-editor'

const EditComponent: React.FunctionComponent<{ value: string }> = props => {
  return <MonacoEditor theme="vs-dark" width="100%" language="json" value={props.value} />
}

export default EditComponent
