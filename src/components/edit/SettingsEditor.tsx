import { Injector } from '@furystack/inject'
import { Repository, Upload } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { Settings } from '@sensenet/default-content-types'
import React, { useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import { withInjector } from '../withInjector'

const SettingsEditor: React.FunctionComponent<{ injector: Injector; content: Settings }> = props => {
  const [currentContentId, setCurrentContentId] = useState(props.content.Id)
  const [loadTimestamp, setLoadTimestamp] = useState(new Date())
  const [settingsValue, setSettingsValue] = useState('')
  const repo = props.injector.GetInstance(Repository)
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
  }, [currentContentId, loadTimestamp])

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      onKeyDown={async ev => {
        if (ev.key.toLowerCase() === 's' && ev.ctrlKey) {
          try {
            ev.preventDefault()
            const verified = JSON.stringify(JSON.parse(settingsValue), undefined, 4)
            const result = await Upload.textAsFile({
              text: verified,
              parentPath: PathHelper.getParentPath(props.content.Path),
              fileName: props.content.Name,
              overwrite: true,
              repository: repo,
              contentTypeName: props.content.Type,
              binaryPropertyName: 'Binary',
            })
            setCurrentContentId(result.Id)
            setLoadTimestamp(new Date())
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
      />
    </div>
  )
}

const extendedComponent = withInjector(SettingsEditor)

export { extendedComponent as SettingsEditor }
