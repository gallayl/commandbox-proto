import { Injector } from '@furystack/inject'
import React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { InjectorContext } from './components/InjectorContext'
import { DesktopLayout } from './components/layout/DesktopLayout'
import { MobileLayout } from './components/layout/MobileLayout'
import { TabletLayout } from './components/layout/TabletLayout'
import { MainRouter } from './components/MainRouter'
import { ResponsiveContainer } from './components/ResponsiveContainer'
import { ThemeProvider } from './components/ThemeProvider'
import './gif'
import './jpg'
import './png'
import { store } from './store'
import './style.css'
import theme from './theme'

ReactDOM.render(
  <Provider store={store}>
    <InjectorContext.Provider value={new Injector()}>
      <HashRouter>
        <ThemeProvider theme={theme}>
          <ResponsiveContainer desktop={DesktopLayout} tablet={TabletLayout} mobile={MobileLayout} innerProps={{}}>
            <MainRouter />
          </ResponsiveContainer>
        </ThemeProvider>
      </HashRouter>
    </InjectorContext.Provider>
  </Provider>,
  document.getElementById('root'),
)
