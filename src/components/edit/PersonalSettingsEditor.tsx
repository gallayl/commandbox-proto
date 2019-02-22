import React, { useContext, useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { personalSettingsModel } from '../../services/MonacoModels'
import { PersonalSettings } from '../../services/PersonalSettings'
import { InjectorContext } from '../InjectorContext'
import { ThemeContext } from '../ThemeContext'

const SettingsEditor: React.FunctionComponent = () => {
  const injector = useContext(InjectorContext)
  const service = injector.GetInstance(PersonalSettings)
  const theme = useContext(ThemeContext)
  const [settingsValue, setSettingsValue] = useState('')

  useEffect(() => {
    const subscription = service.currentValue.subscribe(v => {
      setSettingsValue(JSON.stringify(v, undefined, 4))
    }, true)
    return () => subscription.dispose()
  }, [])

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      onKeyDown={async ev => {
        if (ev.key.toLowerCase() === 's' && ev.ctrlKey) {
          try {
            ev.preventDefault()
            const verified = JSON.parse(settingsValue)
            service.setValue(verified)
          } catch (error) {
            /** */
          }
        }
      }}>
      <MonacoEditor
        theme={theme.palette.type === 'dark' ? 'vs-dark' : 'vs-light'}
        width="100%"
        language="json"
        value={settingsValue}
        onChange={v => setSettingsValue(v)}
        editorDidMount={e => {
          e.setModel(personalSettingsModel)
        }}
      />
    </div>
  )
}

const extendedComponent = SettingsEditor

export default extendedComponent
