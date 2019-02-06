import React from 'react'
import MonacoEditor from 'react-monaco-editor'
import { SensenetCtdLanguage } from '../../utils/monaco-languages/sensenet-ctd'

SensenetCtdLanguage.Register()

export const ContentTypeEditor: React.FunctionComponent<{ value: string }> = props => {
  return <MonacoEditor theme="vs-dark" width="100%" language="sensenet-ctd" value={props.value} />
}

export default ContentTypeEditor
