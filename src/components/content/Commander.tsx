import { Injector } from '@furystack/inject'
import { ConstantContent } from '@sensenet/client-core'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { ContentRouteProvider } from '../../services/ContentRouteProvider'
import { left, right } from '../../store/Commander'
import { createCommandListPanel } from '../ContentListPanel'
import { withInjector } from '../withInjector'

const LeftControl = createCommandListPanel(left)
const RightControl = createCommandListPanel(right)

export const Commander: React.StatelessComponent<
  RouteComponentProps<{ leftParent?: string; rightParent?: string }> & { injector: Injector }
> = props => {
  const getLeftFromPath = () => parseInt(props.match.params.leftParent as string, 10) || ConstantContent.PORTAL_ROOT.Id
  const getRightFromPath = () =>
    parseInt(props.match.params.rightParent as string, 10) || ConstantContent.PORTAL_ROOT.Id

  const [leftParentId, setLeftParentId] = useState(getLeftFromPath())
  const [rightParentId, setRightParentId] = useState(getRightFromPath())

  const [_leftPanelRef, setLeftPanelRef] = useState<null | any>(null)
  const [_rightPanelRef, setRightPanelRef] = useState<null | any>(null)

  useEffect(() => {
    if (getLeftFromPath() !== leftParentId) {
      setLeftParentId(getLeftFromPath())
    }
    if (getRightFromPath() !== rightParentId) {
      setRightParentId(getRightFromPath())
    }
  }, [props.location.pathname])

  useEffect(() => {
    props.history.push(`/content/${leftParentId}/${rightParentId}`)
  }, [leftParentId, rightParentId])

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <LeftControl
        onActivateItem={item => {
          props.history.push(props.injector.GetInstance(ContentRouteProvider).primaryAction(item))
        }}
        containerRef={r => setLeftPanelRef(r)}
        style={{ flexGrow: 1, flexShrink: 0, maxHeight: '100%' }}
        parentId={leftParentId}
        onParentChange={p => {
          setLeftParentId(p.Id)
        }}
        onTabRequest={() => _rightPanelRef && _rightPanelRef.focus()}
      />
      <RightControl
        onActivateItem={item => {
          props.history.push(props.injector.GetInstance(ContentRouteProvider).primaryAction(item))
        }}
        containerRef={r => setRightPanelRef(r)}
        parentId={rightParentId}
        style={{ flexGrow: 1, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.3)', maxHeight: '100%' }}
        onParentChange={p2 => {
          setRightParentId(p2.Id)
        }}
        onTabRequest={() => _leftPanelRef && _leftPanelRef.focus()}
      />
    </div>
  )
}

export default withInjector(withRouter(Commander))
