import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew'
import { LoginState } from '@sensenet/client-core'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import logo from '../../assets/sensenet-icon-32.png'
import { rootStateType } from '../../store'
import { logoutFromRepository } from '../../store/Session'
import { CommandPalette } from '../command-palette/CommandPalette'
import { UserAvatar } from '../UserAvatar'

const mapStateToProps = (state: rootStateType) => ({
  repositoryUrl: state.persistedState.lastRepositoryUrl,
  user: state.session.currentUser,
  loginState: state.session.loginState,
})

const mapDispatchToProps = {
  logoutFromRepository,
}

const DesktopAppBar: React.StatelessComponent<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
> = props => (
  <AppBar position="sticky">
    <Toolbar>
      <a href="#" style={{ display: 'flex', flexDirection: 'row', textDecoration: 'none' }}>
        <img src={logo} style={{ marginRight: '1em', filter: 'drop-shadow(0px 0px 3px black)' }} />
        <Typography variant="h5" color="inherit">
          SENSENET
        </Typography>
      </a>
      <CommandPalette />
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Tooltip placement="bottom" title={props.user.DisplayName || props.user.Name}>
          <Link to={`/edit/${props.user.Id}`} style={{ textDecoration: 'none' }}>
            <UserAvatar user={props.user} repositoryUrl={props.repositoryUrl} />
          </Link>
        </Tooltip>
        {props.loginState === LoginState.Authenticated ? (
          <Tooltip placement="bottom-end" title="Log out">
            <IconButton onClick={() => props.logoutFromRepository()}>
              <PowerSettingsNew />
            </IconButton>
          </Tooltip>
        ) : null}
      </div>
    </Toolbar>
  </AppBar>
)

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DesktopAppBar)
export { connectedComponent as DesktopAppBar }
