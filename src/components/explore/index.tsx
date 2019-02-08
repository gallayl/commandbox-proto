import { Injector } from '@furystack/inject'
import TableCell from '@material-ui/core/TableCell'
import { ODataCollectionResponse, ODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { ContentList } from '@sensenet/list-controls-react'
import React, { useEffect, useRef, useState } from 'react'
import { ContentRouteProvider } from '../../services/ContentRouteProvider'
import Breadcrumbs, { BreadcrumbItem } from '../Breadcrumbs'
import { withInjector } from '../withInjector'
import { SelectionControl } from './SelectionControl'

export const parentLoadOptions: ODataParams<GenericContent> = {}
export const childrenLoadOptions: ODataParams<GenericContent> = {}
export const ancestorsLoadOptions: ODataParams<GenericContent> = {
  orderby: [['Path', 'asc']],
}

export const ExploreComponent: React.StatelessComponent<{
  injector: Injector
  parentId: number
  onParentChange: (newParent: GenericContent) => void
  onTabRequest: () => void
  onActivateItem: (item: GenericContent) => void
  style?: React.CSSProperties
  parentLoadOptions?: ODataParams<GenericContent>
  childrenLoadOptions?: ODataParams<GenericContent>
  ancestorsLoadOptions?: ODataParams<GenericContent>
  containerRef?: (r: HTMLDivElement | null) => void
}> = props => {
  const [parentContent, setParent] = useState<GenericContent | null>(null)
  const [parentId] = useState<number>(props.parentId)
  const [ancestors, setAncestors] = useState<GenericContent[]>([])
  const [children, setChildren] = useState<GenericContent[]>([])
  const [selected, select] = useState<GenericContent[]>([])
  const [activeContent, setActiveContent] = useState<GenericContent>(null as any)

  const prevParent = useRef(parentContent)

  useEffect(() => {
    ;(async () => {
      const parentResponse = await repo.load({
        idOrPath: parentId,
        oDataOptions: {
          ...parentLoadOptions,
          ...props.parentLoadOptions,
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
      setAncestors(ancestorsResponse.d.results)
    })()
  }, [parentId])

  const repo = props.injector.GetInstance(Repository)
  useEffect(() => {
    ;(async () => {
      if (!parentContent) {
        return
      }
      parentContent && props.onParentChange(parentContent)
      const lastParent = prevParent.current

      const ancestorIndex = ancestors.findIndex(a => a.Id === parentContent.Id)
      if (ancestorIndex !== -1) {
        setAncestors(ancestors.slice(0, ancestorIndex))
      } else if (!ancestors.length && lastParent && !lastParent.ParentId) {
        setAncestors([lastParent])
      } else if (
        lastParent &&
        ancestors.length &&
        lastParent.ParentId === ancestors[ancestors.length - 1].Id &&
        parentContent.ParentId === lastParent.Id
      ) {
        setAncestors([...ancestors, lastParent])
      }

      prevParent.current = parentContent

      const childrenResponse = await repo.loadCollection({
        path: parentContent.Path,
        oDataOptions: {
          ...childrenLoadOptions,
          ...props.childrenLoadOptions,
        },
      })
      setChildren(childrenResponse.d.results)
      select([])
      setActiveContent(childrenResponse.d.results[0])
    })()
  }, [parentContent])

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
            setParent(item.content)
          }}
        />
      ) : null}
      <div
        style={{ height: 'calc(100% - 36px)', overflow: 'auto' }}
        tabIndex={0}
        ref={props.containerRef}
        onKeyDown={ev => {
          if (!activeContent) {
            setActiveContent(children[0])
          }
          switch (ev.key) {
            case 'Home':
              setActiveContent(children[0])
              break
            case 'End':
              setActiveContent(children[children.length - 1])
              break
            case 'ArrowUp':
              setActiveContent(children[Math.max(0, children.findIndex(c => c.Id === activeContent.Id) - 1)])
              break
            case 'ArrowDown':
              setActiveContent(
                children[Math.min(children.findIndex(c => c.Id === activeContent.Id) + 1, children.length - 1)],
              )
              break
            case ' ': {
              ev.preventDefault()
              selected.findIndex(s => s.Id === activeContent.Id) !== -1
                ? select([...selected.filter(s => s.Id !== activeContent.Id)])
                : select([...selected, activeContent])
              break
            }
            case 'Insert': {
              selected.findIndex(s => s.Id === activeContent.Id) !== -1
                ? select([...selected.filter(s => s.Id !== activeContent.Id)])
                : select([...selected, activeContent])
              setActiveContent(
                children[Math.min(children.findIndex(c => c.Id === activeContent.Id) + 1, children.length)],
              )
              break
            }
            case '*': {
              if (selected.length === children.length) {
                select([])
              } else {
                select(children)
              }
              break
            }
            case 'Enter': {
              setParent(activeContent)
              break
            }
            case 'Backspace': {
              ancestors.length && setParent(ancestors[ancestors.length - 1])
              break
            }
            case 'Tab':
              ev.preventDefault()
              props.onTabRequest()
              break
            default:
              console.log(ev.key)
          }
        }}>
        <ContentList<GenericContent>
          items={children}
          schema={repo.schemas.getSchema(GenericContent)}
          onRequestActiveItemChange={setActiveContent}
          active={activeContent}
          onItemClick={(ev, content) => {
            if (ev.ctrlKey) {
              if (selected.find(s => s.Id === content.Id)) {
                select(selected.filter(s => s.Id !== content.Id))
              } else {
                select([...selected, content])
              }
            } else if (ev.shiftKey) {
              const activeIndex = (activeContent && children.findIndex(s => s.Id === activeContent.Id)) || 0
              const clickedIndex = children.findIndex(s => s.Id === content.Id)
              const newSelection = Array.from(
                new Set([
                  ...selected,
                  ...[...children].slice(Math.min(activeIndex, clickedIndex), Math.max(activeIndex, clickedIndex) + 1),
                ]),
              )
              select(newSelection)
            } else if (!selected.length || (selected.length === 1 && selected[0].Id !== content.Id)) {
              select([content])
            }
          }}
          onItemDoubleClick={(_ev, item) => {
            if (item.IsFolder) {
              setParent(item)
            } else {
              props.onActivateItem(item)
            }
          }}
          getSelectionControl={(isSelected, content) => <SelectionControl {...{ isSelected, content }} />}
          fieldComponent={options => {
            switch (options.field) {
              case 'DisplayName':
                return <TableCell padding={'none'}>{options.content.DisplayName || options.content.Name}</TableCell>
            }
            return null
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

const connectedComponent = withInjector(ExploreComponent)
export default connectedComponent
