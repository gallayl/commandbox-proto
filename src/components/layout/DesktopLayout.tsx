import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import CssBaseline from '@material-ui/core/CssBaseline'
import logo from '../../assets/sensenet-icon-32.png'
import { DesktopDrawer } from '../drawer/DesktopDrawer'
import { UserAvatar } from '../UserAvatar'

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
    <AppBar position="sticky">
      <Toolbar>
        <a href="#" style={{ display: 'flex', flexDirection: 'row', textDecoration: 'none' }}>
          <img src={logo} style={{ marginRight: '1em', filter: 'drop-shadow(0px 0px 3px black)' }} />
          <Typography variant="h5" color="inherit">
            SN ADMIN UI
          </Typography>
        </a>
        <div style={{ flex: 1 }} />
        <UserAvatar user={{} as any} />
      </Toolbar>
    </AppBar>
    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'row' }}>
      <DesktopDrawer />
      <div style={{ overflow: 'auto', flexGrow: 1 }}>{props.children}</div>
    </div>
  </div>
)
