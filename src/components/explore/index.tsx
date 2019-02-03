import { Injector } from '@furystack/inject'
import Typography from '@material-ui/core/Typography'
import { Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { ContentList } from '@sensenet/list-controls-react'
import React from 'react'
import { connect } from 'react-redux'
import { rootStateType } from '../../store'
import { init, loadParent, select } from '../../store/Explore'

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
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
> = props => {
  if (!props.isInitialized) {
    props.init()
    return null
  }
  const repo = Injector.Default.GetInstance(Repository)
  return (
    <div style={{ flexGrow: 1 }}>
      <Typography variant="h3">Explore</Typography>
      <ContentList<GenericContent>
        items={props.children}
        schema={repo.schemas.getSchema(GenericContent)}
        onItemDoubleClick={(_ev, item) => {
          props.loadParent(item.Path)
        }}
        fieldsToDisplay={['DisplayName', 'CreatedBy', 'CreationDate']}
        selected={props.selected}
        onRequestSelectionChange={props.select}
        icons={{}}
      />
    </div>
  )
}

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExploreComponent)
export { connectedComponent as Explore }
