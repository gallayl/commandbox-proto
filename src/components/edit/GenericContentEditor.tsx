import { Injector } from '@furystack/inject'
import { Repository } from '@sensenet/client-core'
import { EditView } from '@sensenet/controls-react'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useState } from 'react'
import { withInjector } from '../withInjector'

const GenericContentEditor: React.FunctionComponent<{ injector: Injector; content: GenericContent }> = props => {
  const repo = props.injector.GetInstance(Repository)
  const schema = repo.schemas.getSchemaByName(props.content.Type)

  const [savedContent, setSavedContent] = useState({ ...props.content })

  return (
    <div style={{ width: '100%', height: '100%', padding: '3em', overflow: 'auto' }}>
      <EditView
        schema={schema}
        content={props.content}
        repository={repo}
        contentTypeName={props.content.Type}
        onSubmit={async (id, content) => {
          const change = {} as Partial<GenericContent>
          const changeKeys = Object.keys(content)

          for (const key of changeKeys) {
            if (savedContent[key as keyof typeof props.content] !== content[key as keyof typeof content]) {
              change[key as keyof typeof change] = content[key as keyof typeof content]
            }
          }

          const result = await repo.patch({
            idOrPath: id,
            content: change,
          })
          setSavedContent({ ...result.d })
        }}
      />
    </div>
  )
}

const wrappedComponent = withInjector(GenericContentEditor)

export { wrappedComponent as GenericContentEditor }
