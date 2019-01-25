import React from 'react'
import * as ReactDOM from 'react-dom'
import './png'
import './jpg'
import './style.css'
import theme from './theme'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { ResponsiveContainer } from './components/ResponsiveContainer'
import { DesktopLayout } from './components/layout/DesktopLayout'
import { TabletLayout } from './components/layout/TabletLayout'
import { MobileLayout } from './components/layout/MobileLayout'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { MainRouter } from './components/MainRouter'

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <HashRouter>
        <ResponsiveContainer desktop={DesktopLayout} tablet={TabletLayout} mobile={MobileLayout} innerProps={{}}>
          <MainRouter />
        </ResponsiveContainer>
      </HashRouter>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('example'),
)
