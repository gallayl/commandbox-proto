import AppBar from "@material-ui/core/AppBar";
import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { UserAvatar } from "../UserAvatar";
import logo from '../../assets/sensenet-icon-32.png'
import { rootStateType } from "../../store";
import { connect } from "react-redux";

const mapStateToProps = (state: rootStateType) => ({
    repositoryUrl: state.persistedState.lastRepositoryUrl,
    user: state.session.currentUser
})

const DesktopAppBar: React.StatelessComponent<ReturnType<typeof mapStateToProps>> = (props) =>     <AppBar position="sticky">
<Toolbar>
  <a href="#" style={{ display: 'flex', flexDirection: 'row', textDecoration: 'none' }}>
    <img src={logo} style={{ marginRight: '1em', filter: 'drop-shadow(0px 0px 3px black)' }} />
    <Typography variant="h5" color="inherit">
      SN ADMIN UI
    </Typography>
  </a>
  <div style={{ flex: 1 }} />
  <UserAvatar user={props.user} repositoryUrl={props.repositoryUrl} />
</Toolbar>
</AppBar>

const connectedComponent = connect(mapStateToProps)(DesktopAppBar)
export {connectedComponent as DesktopAppBar}