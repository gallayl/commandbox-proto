import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { DesktopLayout } from './components/layout/DesktopLayout'
import { MobileLayout } from './components/layout/MobileLayout'
import { TabletLayout } from './components/layout/TabletLayout'
import { MainRouter } from './components/MainRouter'
import { ResponsiveContainer } from './components/ResponsiveContainer'
import './jpg'
import './png'
import { store } from './store'
import './style.css'
import theme from './theme'

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
