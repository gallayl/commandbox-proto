import { Injector } from '@furystack/inject'
import { Repository } from '@sensenet/client-core'
import { DocumentViewer } from '@sensenet/document-viewer-react'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { withRouter } from 'react-router'
import { withInjector } from './withInjector'

const DocViewer: React.FunctionComponent<
  RouteComponentProps<{ documentId: string }> & { injector: Injector }
> = props => {
  const documentId = parseInt(props.match.params.documentId, 10)
  if (isNaN(documentId)) {
    throw Error(`Invalid document Id: ${documentId}`)
  }

  const hostName = props.injector.GetInstance(Repository).configuration.repositoryUrl

  return (
    <div style={{ overflow: 'hidden', width: '100%', height: '100%', position: 'fixed' }}>
      <DocumentViewer documentIdOrPath={documentId} hostName={hostName} />
    </div>
  )
}

const extendedComponent = withInjector(withRouter(DocViewer))

export default extendedComponent
