import React, { useContext } from 'react'
import '../../services/MonacoModels/PersonalSettingsModel'
import { PersonalSettings } from '../../services/PersonalSettings'
import { InjectorContext } from '../InjectorContext'
import { PersonalSettingsContext } from '../PersonalSettingsContext'
import { TextEditor } from './TextEditor'

const SettingsEditor: React.FunctionComponent = () => {
  const injector = useContext(InjectorContext)
  const service = injector.GetInstance(PersonalSettings)
  const settings = useContext(PersonalSettingsContext)

  return (
    <TextEditor
      content={{ Type: 'Settings', Name: 'PersonalSettings' } as any}
      loadContent={async () => JSON.stringify(settings, undefined, 3)}
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
