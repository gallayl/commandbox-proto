import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import React from 'react'
import { rootStateType } from '../../store'
import { toggleDrawer } from '../../store/Drawer'
import { connect } from 'react-redux'
import { NavLink, RouteComponentProps, withRouter, matchPath } from 'react-router-dom'
import Tooltip from '@material-ui/core/Tooltip'
import Paper from '@material-ui/core/Paper'
import ListItemText from '@material-ui/core/ListItemText'

const mapStateToProps = (state: rootStateType) => ({
  items: state.drawer.items,
  opened: state.drawer.opened,
})

const mapDispatchToProps = {
  toggleDrawer,
}

const DesktopDrawer: React.StatelessComponent<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps
> = props => {
  if (!props.items || !props.items.length) return null

  return (
    <Paper style={{ flexGrow: 0, flexShrink: 0 }}>
      <List
        style={{
          width: props.opened ? 270 : 55,
          height: '100%',
          flexGrow: 1,
          flexShrink: 0,
          display: 'flex',
          overflow: 'hidden',
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}>
        <div>
          {props.items.map(item => {
            const isActive = matchPath(props.location.pathname, item.url)
            return isActive ? (
              <ListItem button disabled>
                <Tooltip
                  title={
                    <React.Fragment>
                      {item.primaryText} <br /> {item.secondaryText}
                    </React.Fragment>
                  }
                  placement="right">
                  <ListItemIcon>{item.icon}</ListItemIcon>
                </Tooltip>
                {props.opened ? <ListItemText primary={item.primaryText} secondary={item.secondaryText} /> : null}
              </ListItem>
            ) : (
              <NavLink
                to={item.url}
                activeStyle={{ opacity: 1 }}
                style={{ textDecoration: 'none', opacity: 0.54 }}
                key={item.primaryText}>
                <ListItem button>
                  <Tooltip
                    title={
                      <React.Fragment>
                        {item.primaryText} <br /> {item.secondaryText}
                      </React.Fragment>
                    }
                    placement="right">
                    <ListItemIcon>{item.icon}</ListItemIcon>
                  </Tooltip>
                  {props.opened ? <ListItemText primary={item.primaryText} secondary={item.secondaryText} /> : null}
                </ListItem>
              </NavLink>
            )
          })}
        </div>
        <ListItem button onClick={props.toggleDrawer} key="expandcollapse">
          <Tooltip title={props.opened ? 'Collapse' : 'Expand'} placement="right">
            <ListItemIcon>{props.opened ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}</ListItemIcon>
          </Tooltip>
          {props.opened ? <ListItemText primary="Collapse sidebar" /> : null}
        </ListItem>
      </List>
    </Paper>
  )
}

const connectedComponent = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(DesktopDrawer),
)
export { connectedComponent as DesktopDrawer }
