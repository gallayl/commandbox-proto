import { Injector } from '@furystack/inject'
import { ConstantContent, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { ContentList } from '@sensenet/list-controls-react'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { rootStateType } from '../../store'
import { init, loadParent, select } from '../../store/Explore'
import Breadcrumbs from '../Breadcrumbs'

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
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<{ folderId?: string }>
> = props => {
  const folderIdFromPath = props.match.params.folderId && parseInt(props.match.params.folderId, 10)

  if (folderIdFromPath && folderIdFromPath !== props.parent.Id) {
    props.loadParent(folderIdFromPath)
    return null
  }

  if (!props.isInitialized) {
    props.history.push(`/content/${ConstantContent.PORTAL_ROOT.Id}`)
    props.init()
    return null
  }

  const repo = Injector.Default.GetInstance(Repository)
  return (
    <div style={{ flexGrow: 1, padding: '.3em 0' }}>
      <Breadcrumbs content={props.ancestors} currentContent={props.parent} />
      <ContentList<GenericContent>
        items={props.children}
        schema={repo.schemas.getSchema(GenericContent)}
        onItemDoubleClick={(_ev, item) => {
          item.IsFolder ? props.history.push(`/content/${item.Id}`) : props.history.push(`/edit/${item.Id}`)
        }}
        fieldsToDisplay={['DisplayName', 'CreatedBy', 'CreationDate']}
        selected={props.selected}
        onRequestSelectionChange={props.select}
        icons={{}}
      />
    </div>
  )
}

const connectedComponent = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ExploreComponent),
)
export default connectedComponent
