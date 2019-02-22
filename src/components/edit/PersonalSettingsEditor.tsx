import React, { useContext, useEffect, useState } from 'react'
import '../../services/MonacoModels/PersonalSettingsModel'
import { PersonalSettings } from '../../services/PersonalSettings'
import { InjectorContext } from '../InjectorContext'
import { TextEditor } from './TextEditor'

const SettingsEditor: React.FunctionComponent = () => {
  const injector = useContext(InjectorContext)
  const service = injector.GetInstance(PersonalSettings)
  const [settingsValue, setSettingsValue] = useState(JSON.stringify(service.currentValue.getValue(), undefined, 4))

  useEffect(() => {
    const subscription = service.currentValue.subscribe(v => {
      setSettingsValue(JSON.stringify(v, undefined, 4))
    }, true)
    return () => subscription.dispose()
  }, [])

  return (
    <TextEditor
      content={{ Type: 'Settings', Name: 'PersonalSettings' } as any}
      loadContent={async () => settingsValue}
      saveContent={async (_c, v) => {
        try {
          service.setValue(JSON.parse(v))
        } catch (error) {
          /** */
        }
      }}
    />
  )
}

const extendedComponent = SettingsEditor

export default extendedComponent
