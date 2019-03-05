import { ConstantContent } from '@sensenet/client-core'
import React, { useContext, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { ContentContextProvider } from '../../services/ContentContextProvider'
import { left } from '../../store/Commander'
import { createCommandListPanel } from '../ContentListPanel'
import { InjectorContext } from '../InjectorContext'
import { Tree } from '../tree/index'

const ExploreControl = createCommandListPanel(left)

export const ExploreComponent: React.FunctionComponent<RouteComponentProps<{ folderId?: string }>> = props => {
  const getLeftFromPath = () => parseInt(props.match.params.folderId as string, 10) || ConstantContent.PORTAL_ROOT.Id
  const injector = useContext(InjectorContext)
  const [leftParentId, setLeftParentId] = useState(getLeftFromPath())

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <Tree
        style={{ flexGrow: 1, flexShrink: 0, borderRight: '1px solid rgba(128,128,128,.2)', overflow: 'auto' }}
        parentPath={ConstantContent.PORTAL_ROOT.Path}
        onItemClick={item => setLeftParentId(item.Id)}
        activeItemId={leftParentId}
      />
      <ExploreControl
        onActivateItem={item => {
          props.history.push(injector.GetInstance(ContentContextProvider).getPrimaryActionUrl(item))
        }}
        style={{ flexGrow: 7, flexShrink: 0, maxHeight: '100%' }}
        onParentChange={p => {
          setLeftParentId(p.Id)
        }}
        parentId={leftParentId}
        onTabRequest={() => {
          /** */
        }}
      />
    </div>
  )
}

const connected = withRouter(ExploreComponent)
export { connected as Explore }
