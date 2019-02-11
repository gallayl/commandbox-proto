import { Injector } from '@furystack/inject'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { matchPath, NavLink, RouteComponentProps, withRouter } from 'react-router-dom'
import { defaultSettings, PersonalSettings } from '../../services/PersonalSettings'
import { rootStateType } from '../../store'
import { toggleDrawer } from '../../store/Drawer'
import { withInjector } from '../withInjector'

const mapStateToProps = (state: rootStateType) => ({
  items: state.drawer.items,
  opened: state.drawer.opened,
})

const mapDispatchToProps = {
  toggleDrawer,
}

const DesktopDrawer: React.StatelessComponent<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps & { injector: Injector }
> = props => {
  const [drawerConfig, setDrawerConfig] = useState(defaultSettings.drawer)
  const service = props.injector.GetInstance(PersonalSettings)
  useEffect(() => {
    const subscription = service.currentValue.subscribe(v => {
      setDrawerConfig(v.drawer)
    }, true)
    return () => subscription.dispose()
  })

  if (!drawerConfig.enabled) {
    return null
  }

  return (
    <Paper style={{ flexGrow: 0, flexShrink: 0 }}>
      <List
        dense={true}
        style={{
          width: props.opened ? 270 : 55,
          height: '100%',
          flexGrow: 1,
          flexShrink: 0,
          display: 'flex',
          overflow: 'hidden',
          justifyContent: 'space-between',
          flexDirection: 'column',
          backgroundColor: '#222',
          paddingTop: '1em',
        }}>
        <div style={{ paddingTop: '1em' }}>
          {props.items
            .filter(i => drawerConfig.items && drawerConfig.items.indexOf(i.primaryText) !== -1)
            .map(item => {
              const isActive = matchPath(props.location.pathname, item.url)
              return isActive ? (
                <ListItem button={true} disabled={true} key={item.primaryText}>
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
                  <ListItem button={true}>
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
        <ListItem button={true} onClick={props.toggleDrawer} key="expandcollapse">
          <Tooltip title={props.opened ? 'Collapse' : 'Expand'} placement="right">
            <ListItemIcon>{props.opened ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}</ListItemIcon>
          </Tooltip>
          {props.opened ? <ListItemText primary="Collapse sidebar" /> : null}
        </ListItem>
      </List>
    </Paper>
  )
}

const connectedComponent = withInjector(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(DesktopDrawer),
  ),
)
export { connectedComponent as DesktopDrawer }
