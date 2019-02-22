import { ConstantContent } from '@sensenet/client-core'
import React, { useContext, useEffect, useState } from 'react'
import { matchPath, RouteComponentProps, withRouter } from 'react-router'
import { ContentContextProvider } from '../../services/ContentContextProvider'
import { left, right } from '../../store/Commander'
import { createCommandListPanel } from '../ContentListPanel'
import { InjectorContext } from '../InjectorContext'

const LeftControl = createCommandListPanel(left)
const RightControl = createCommandListPanel(right)

export interface CommanderRouteParams {
  folderId?: string
  rightParent?: string
}

export const Commander: React.StatelessComponent<RouteComponentProps<CommanderRouteParams>> = props => {
  const injector = useContext(InjectorContext)
  const getLeftFromPath = (params: CommanderRouteParams) =>
    parseInt(params.folderId as string, 10) || ConstantContent.PORTAL_ROOT.Id
  const getRightFromPath = (params: CommanderRouteParams) =>
    parseInt(params.rightParent as string, 10) || ConstantContent.PORTAL_ROOT.Id

  const [leftParentId, setLeftParentId] = useState(getLeftFromPath(props.match.params))
  const [rightParentId, setRightParentId] = useState(getRightFromPath(props.match.params))

  const [_leftPanelRef, setLeftPanelRef] = useState<null | any>(null)
  const [_rightPanelRef, setRightPanelRef] = useState<null | any>(null)

  useEffect(() => {
    const historyChangeListener = props.history.listen((location, action) => {
      const match = matchPath(location.pathname, props.match.path)
      console.log(action)
      if (match) {
        if (getLeftFromPath(match.params) !== leftParentId) {
          setLeftParentId(getLeftFromPath(match.params))
        }
        if (getRightFromPath(match.params) !== rightParentId) {
          setRightParentId(getRightFromPath(match.params))
        }
      }
    })
    return () => {
      historyChangeListener()
    }
  }, [leftParentId, rightParentId])

  useEffect(() => {
    if (
      props.match.params.folderId !== leftParentId.toString() ||
      props.match.params.rightParent !== rightParentId.toString()
    ) {
      props.history.push(`/content/${leftParentId}/${rightParentId}`)
    }
  }, [leftParentId, rightParentId])

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <LeftControl
        onActivateItem={item => {
          props.history.push(injector.GetInstance(ContentContextProvider).getPrimaryActionUrl(item))
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
          props.history.push(injector.GetInstance(ContentContextProvider).getPrimaryActionUrl(item))
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

export default withRouter(Commander)
