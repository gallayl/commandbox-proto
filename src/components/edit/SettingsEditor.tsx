import { Repository, Upload } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { Settings } from '@sensenet/default-content-types'
import React, { useContext, useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { InjectorContext } from '../InjectorContext'
import { Uri, languages } from 'monaco-editor'

const PortalSettingsPath = `sensenet://settings/PortalSettings`
const uri = Uri.parse(PortalSettingsPath)
languages.json.jsonDefaults.setDiagnosticsOptions({
  validate: true,
  enableSchemaRequest: false,
  schemas: [
    {
      uri: 'sn-admin-portal-settings',
      fileMatch: [uri.toString()],
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
                description: 'Choose between a two-panel (commander) or a tree + single panel (explorer) style view',
                enum: ['commander', 'explorer'],
              },
            },
          },
        },
        type: 'object',
        required: ['content', 'drawer'],
        properties: {
          theme: { enum: ['dark', 'light'] },
          content: { $ref: '#/definitions/content' },
          drawer: { $ref: '#/definitions/drawer' },
          commandPalette: { $ref: '#/definitions/commandPalette' },
        },
      },
    },
  ],
})

const SettingsEditor: React.FunctionComponent<{ content: Settings }> = props => {
  const injector = useContext(InjectorContext)
  const [settingsValue, setSettingsValue] = useState('')
  const repo = injector.GetInstance(Repository)
  useEffect(() => {
    ;(async () => {
      const binaryPath = props.content.Binary && props.content.Binary.__mediaresource.media_src
      if (!binaryPath) {
        throw Error("Content doesn't have a valid path to the binary field! ")
      }
      const settingFile = await repo.fetch(PathHelper.joinPaths(repo.configuration.repositoryUrl, binaryPath))
      if (settingFile.ok) {
        const text = await settingFile.text()
        setSettingsValue(text)
      }
    })()
  }, [props.content.Id])

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      onKeyDown={async ev => {
        if (ev.key.toLowerCase() === 's' && ev.ctrlKey) {
          try {
            ev.preventDefault()
            const verified = JSON.stringify(JSON.parse(settingsValue), undefined, 4)
            await Upload.textAsFile({
              text: verified,
              parentPath: PathHelper.getParentPath(props.content.Path),
              fileName: props.content.Name,
              overwrite: true,
              repository: repo,
              contentTypeName: props.content.Type,
              binaryPropertyName: 'Binary',
            })
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
        editorDidMount={(editor, monaco) => {
          const uri = monaco.Uri.parse(`sensenet://settings/${props.content.Type}`)
          if (!monaco.editor.getModel(uri)) {
            const m = monaco.editor.createModel(settingsValue, 'json', uri)
            editor.setModel(m)
          } else {
            editor.setModel(monaco.editor.getModel(uri))
          }
        }}
      />
    </div>
  )
}

const extendedComponent = SettingsEditor

export { extendedComponent as SettingsEditor }
