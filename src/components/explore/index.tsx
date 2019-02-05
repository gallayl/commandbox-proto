import { Injector } from '@furystack/inject'
import { Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { ContentList } from '@sensenet/list-controls-react'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { ContentRouteProvider } from '../../services/ContentRouteProvider'
import { rootStateType } from '../../store'
import { init, loadParent, select } from '../../store/Explore'
import Breadcrumbs, { BreadcrumbItem } from '../Breadcrumbs'
import { withInjector } from '../withInjector'

const mapStateToProps = (state: rootStateType) => ({
  isInitialized: state.explore.isInitialized,
  parent: state.explore.parent,
  children: state.explore.children,
  ancestors: state.explore.ancestors,
  selected: state.explore.selected,
})

const mapDispatchToProps = {
  init,
  loadParent,
  select,
}

export const ExploreComponent: React.StatelessComponent<
  ReturnType<typeof mapStateToProps> &
    typeof mapDispatchToProps &
    RouteComponentProps<{ folderId?: string }> & { injector: Injector }
> = props => {
  const folderIdFromPath = props.match.params.folderId && parseInt(props.match.params.folderId, 10)

  if (folderIdFromPath && folderIdFromPath !== props.parent.Id) {
    props.loadParent(folderIdFromPath)
    return null
  }

  if (!props.isInitialized) {
    props.init()
    return null
  }

  const repo = props.injector.GetInstance(Repository)
  return (
    <div style={{ flexGrow: 1, padding: '.3em 0' }}>
      <Breadcrumbs
        content={props.ancestors.map(
          content =>
            ({
              displayName: content.DisplayName || content.Name,
              title: content.Path,
              url: props.injector.GetInstance(ContentRouteProvider).primaryAction(content),
            } as BreadcrumbItem),
        )}
        currentContent={{
          displayName: props.parent.DisplayName || props.parent.Name,
          title: props.parent.Path,
          url: props.injector.GetInstance(ContentRouteProvider).primaryAction(props.parent),
        }}
      />
      <ContentList<GenericContent>
        items={props.children}
        schema={repo.schemas.getSchema(GenericContent)}
        onItemDoubleClick={(_ev, item) => {
          props.history.push(props.injector.GetInstance(ContentRouteProvider).primaryAction(item))
        }}
        fieldsToDisplay={['DisplayName', 'CreatedBy', 'CreationDate']}
        selected={props.selected}
        onRequestSelectionChange={props.select}
        icons={{}}
      />
    </div>
  )
}

const connectedComponent = withInjector(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(ExploreComponent),
  ),
)
export default connectedComponent
