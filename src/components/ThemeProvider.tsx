import createMuiTheme, { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import React, { useContext, useEffect, useState } from 'react'
import { PersonalSettings } from '../services/PersonalSettings'
import { InjectorContext } from './InjectorContext'
import { ThemeContext } from './ThemeContext'

const mergeThemes = (options: ThemeOptions, type: 'light' | 'dark') =>
  createMuiTheme({
    ...options,
    palette: {
      ...options.palette,
      type,
    },
  })

export const ThemeProviderComponent: React.FunctionComponent<{ theme: ThemeOptions }> = props => {
  const injector = useContext(InjectorContext)
  const ps = injector.GetInstance(PersonalSettings)
  const [themeType, setThemeType] = useState(ps.currentValue.getValue().theme)
  const [theme, setTheme] = useState(mergeThemes(props.theme, themeType))

  useEffect(() => {
    const subscription = ps.currentValue.subscribe(v => {
      setThemeType(v.theme)
      setTheme(mergeThemes(props.theme, v.theme))
    })
    return () => {
      subscription.dispose()
    }
  }, [themeType])

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeContext.Provider value={theme}>{props.children}</ThemeContext.Provider>
    </MuiThemeProvider>
  )
}

const extendedComponent = ThemeProviderComponent

export { extendedComponent as ThemeProvider }
