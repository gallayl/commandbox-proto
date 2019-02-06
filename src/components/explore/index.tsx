import { Injector } from '@furystack/inject'
import { ConstantContent, ODataCollectionResponse, ODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { ContentList } from '@sensenet/list-controls-react'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { ContentRouteProvider } from '../../services/ContentRouteProvider'
import Breadcrumbs, { BreadcrumbItem } from '../Breadcrumbs'
import { withInjector } from '../withInjector'

export const parentLoadOptions: ODataParams<GenericContent> = {}
export const childrenLoadOptions: ODataParams<GenericContent> = {
  select: ['IsFolder'],
}
export const ancestorsLoadOptions: ODataParams<GenericContent> = {
  select: ['IsFolder'],
  orderby: [['Path', 'asc']],
}

export const ExploreComponent: React.StatelessComponent<
  RouteComponentProps<{ folderId?: string }> & {
    injector: Injector
    style?: React.CSSProperties
    parentLoadOptions?: ODataParams<GenericContent>
    childrenLoadOptions?: ODataParams<GenericContent>
    ancestorsLoadOptions?: ODataParams<GenericContent>
  }
> = props => {
  const folderIdFromPath = (props.match.params.folderId && parseInt(props.match.params.folderId, 10)) || undefined
  const [parentId, setParentId] = useState<number>(folderIdFromPath || ConstantContent.PORTAL_ROOT.Id)

  const [parentContent, setParent] = useState<GenericContent | null>(null)
  const [ancestors, setAncestors] = useState<GenericContent[]>([])
  const [children, setChildren] = useState<GenericContent[]>([])
  const [selected, select] = useState<GenericContent[]>([])

  const repo = props.injector.GetInstance(Repository)
  useEffect(() => {
    ;(async () => {
      const parentResponse = await repo.load({
        idOrPath: parentId,
        oDataOptions: {
          ...parentLoadOptions,
          ...props.parentLoadOptions,
        },
      })
      const childrenResponse = await repo.loadCollection({
        path: parentResponse.d.Path,
        oDataOptions: {
          ...childrenLoadOptions,
          ...props.childrenLoadOptions,
        },
      })
      const ancestorsResponse = await repo.executeAction<undefined, ODataCollectionResponse<GenericContent>>({
        idOrPath: parentResponse.d.Path,
        method: 'GET',
        name: 'Ancestors',
        body: undefined,
        oDataOptions: {
          ...ancestorsLoadOptions,
          ...props.ancestorsLoadOptions,
        },
      })
      setParent(parentResponse.d)
      setChildren(childrenResponse.d.results)
      setAncestors(ancestorsResponse.d.results)
    })()
  }, [parentId])

  return (
    <div style={{ flexGrow: 1, padding: '.3em 0', ...props.style }}>
      {parentContent ? (
        <Breadcrumbs
          content={ancestors.map(
            content =>
              ({
                displayName: content.DisplayName || content.Name,
                title: content.Path,
                url: props.injector.GetInstance(ContentRouteProvider).primaryAction(content),
                content,
              } as BreadcrumbItem),
          )}
          currentContent={{
            displayName: parentContent.DisplayName || parentContent.Name,
            title: parentContent.Path,
            url: props.injector.GetInstance(ContentRouteProvider).primaryAction(parentContent),
            content: parentContent,
          }}
          onItemClick={(_ev, item) => {
            setParentId(item.content.Id)
            props.history.push(item.url)
          }}
        />
      ) : null}
      <div style={{ height: 'calc(100% - 36px)', overflow: 'auto' }}>
        <ContentList<GenericContent>
          items={children}
          schema={repo.schemas.getSchema(GenericContent)}
          onItemDoubleClick={(_ev, item) => {
            props.history.push(props.injector.GetInstance(ContentRouteProvider).primaryAction(item))
            setParentId(item.Id)
          }}
          fieldsToDisplay={['DisplayName', 'CreatedBy', 'CreationDate']}
          selected={selected}
          onRequestSelectionChange={select}
          icons={{}}
        />
      </div>
    </div>
  )
}

const connectedComponent = withInjector(
  withRouter(
    // connect(
    //   mapStateToProps,
    //   mapDispatchToProps,
    // )(ExploreComponent),
    ExploreComponent,
  ),
)
export default connectedComponent
