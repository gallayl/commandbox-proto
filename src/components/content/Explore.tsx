import { Injector } from '@furystack/inject'
import { ConstantContent } from '@sensenet/client-core'
import React, { useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { ContentRouteProvider } from '../../services/ContentRouteProvider'
import { left } from '../../store/Commander'
import { createCommandListPanel } from '../ContentListPanel'
import { withInjector } from '../withInjector'

const ExploreControl = createCommandListPanel(left)

export const ExploreComponent: React.FunctionComponent<
  RouteComponentProps<{ leftParent?: string }> & { injector: Injector }
> = props => {
  const getLeftFromPath = () => parseInt(props.match.params.leftParent as string, 10) || ConstantContent.PORTAL_ROOT.Id

  const [leftParentId, setLeftParentId] = useState(getLeftFromPath())

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <ExploreControl
        onActivateItem={item => {
          props.history.push(props.injector.GetInstance(ContentRouteProvider).primaryAction(item))
        }}
        style={{ flexGrow: 1, flexShrink: 0, maxHeight: '100%' }}
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

const connected = withInjector(withRouter(ExploreComponent))
export { connected as Explore }
