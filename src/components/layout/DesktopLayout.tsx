import CssBaseline from '@material-ui/core/CssBaseline'
import React from 'react'
import { DesktopAppBar } from '../appbar/DesktopAppBar'
import { DesktopDrawer } from '../drawer/DesktopDrawer'

export const DesktopLayout: React.StatelessComponent = props => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    }}>
    <CssBaseline />
    <DesktopAppBar />
    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'row', height: '100%' }}>
      <DesktopDrawer />
      <div style={{ display: 'flex', flexGrow: 1 }}>{props.children}</div>
    </div>
  </div>
)
