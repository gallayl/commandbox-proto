import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { DesktopDrawer } from '../drawer/DesktopDrawer'
import { DesktopAppBar } from '../appbar/DesktopAppBar';

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
    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'row' }}>
      <DesktopDrawer />
      <div style={{display: "flex"}}>{props.children}</div>
    </div>
  </div>
)
