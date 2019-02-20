import AppBar from '@material-ui/core/AppBar'
import * as React from 'react'

import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import IconButton from '@material-ui/core/IconButton'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Search from '@material-ui/icons/Search'
import dashboard from '../assets/dashboard.PNG'
import maros from '../assets/maros.png'
import logo from '../assets/sn-zseni__listekn__s.png'
import { CommandBox } from '../CommandBox'
import { ThemeContext } from '../ThemeContext'

interface LayoutState {
  isActive: boolean
  search: string
}

export class Layout extends React.Component<{}, LayoutState> {
  public state: LayoutState = { isActive: false, search: '' }

  public static contextType = ThemeContext

  /**
   *
   */
  constructor(props: Layout['props']) {
    super(props)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  public componentDidMount() {
    document.addEventListener('keyup', this.handleKeyUp)
    document.addEventListener('keydown', this.handleKeyUp)
  }

  public componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyUp)
    document.removeEventListener('keydown', this.handleKeyUp)
  }

  private handleKeyUp(ev: KeyboardEvent) {
    if (ev.key.toLowerCase() === 'p' && ev.ctrlKey) {
      ev.stopImmediatePropagation()
      ev.preventDefault()
      if (ev.shiftKey) {
        this.setState({ search: '>', isActive: true })
      } else {
        this.setState({ search: '', isActive: true })
      }
    } else {
      if (ev.key === 'Escape') {
        this.setState({ isActive: false })
      }
    }
  }

  public render() {
    const theme: Theme = this.context

    return (
      <div>
        <AppBar position="fixed" style={{ backgroundColor: /*'#363636'*/ theme.palette.background.default }}>
          <Toolbar style={{}}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <img src={logo} style={{ marginRight: '1em' }} />
              <Typography variant="h5" color="inherit">
                Sensenet
              </Typography>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexGrow: 1,
                marginLeft: '2em',
              }}>
              <IconButton
                color="inherit"
                style={{
                  opacity: this.state.isActive ? 0 : 1,
                  transition: 'opacity ease-in-out .3s',
                }}
                onClick={() => this.setState({ isActive: !this.state.isActive })}>
                <Search />
              </IconButton>
              <div style={{ width: '100%' }}>
                {this.state.isActive ? (
                  <ClickAwayListener onClickAway={() => this.setState({ isActive: false })}>
                    <CommandBox
                      search={this.state.search}
                      onDismiss={() => this.setState({ isActive: false, search: '' })}
                    />
                  </ClickAwayListener>
                ) : null}
              </div>
            </div>
            <div
              style={{
                overflow: 'hidden',
                borderRadius: '50%',
                width: '64px',
                height: '64px',
                boxShadow: '0px 0px 8px black',
              }}>
              <div
                style={{
                  marginLeft: '2em',
                  display: 'flex',
                  flexDirection: 'row-reverse',
                }}>
                <img src={maros} style={{ height: '64px' }} />
              </div>
            </div>
          </Toolbar>
        </AppBar>
        <div>
          <img src={dashboard} style={{ marginTop: '64px' }} />
        </div>
      </div>
    )
  }
}
