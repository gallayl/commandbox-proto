import { Injector } from '@furystack/inject'
import React, { useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { PersonalSettings } from '../../services/PersonalSettings'
import { withInjector } from '../withInjector'

const SettingsEditor: React.FunctionComponent<{ injector: Injector }> = props => {
  const service = props.injector.GetInstance(PersonalSettings)

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
        theme="vs-dark"
        width="100%"
        language="json"
        value={settingsValue}
        onChange={v => setSettingsValue(v)}
        editorWillMount={monaco => {
          monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            enableSchemaRequest: false,
            schemas: [
              {
                uri: 'sn-admin-personal-settings',
                fileMatch: ['*'],
                schema: {
                  definitions: {
                    drawer: {
                      type: 'object',
                      description: 'Options for the left drawer',
                      properties: {
                        enabled: { type: 'boolean', description: 'Enable or disable the drawer' },
                        items: {
                          description: 'An array of enabled items',
                          type: 'array',
                          uniqueItems: true,
                          items: { enum: ['Content', 'Search', 'Users and Groups', 'Setup'] },
                        },
                      },
                    },
                    commandPalette: {
                      type: 'object',
                      description: 'Options for the command palette',
                      properties: {
                        enabled: { type: 'boolean', description: 'Enable or disable the command palette' },
                        wrapQuery: {
                          type: 'string',
                          description: 'A wrapper for all queries executed from the command palette',
                        },
                      },
                    },
                    content: {
                      type: 'object',
                      description: 'Content browsing and basic editing functions',
                      properties: {
                        browseType: {
                          description:
                            'Choose between a two-panel (commander) or a tree + single panel (explorer) style view',
                          enum: ['commander', 'explorer'],
                        },
                      },
                    },
                  },
                  type: 'object',
                  required: ['content', 'drawer'],
                  properties: {
                    content: { $ref: '#/definitions/content' },
                    drawer: { $ref: '#/definitions/drawer' },
                    commandPalette: { $ref: '#/definitions/commandPalette' },
                  },
                },
              },
            ],
          })
        }}
      />
    </div>
  )
}

const extendedComponent = withInjector(SettingsEditor)

export default extendedComponent
