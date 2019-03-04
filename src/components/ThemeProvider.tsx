import createMuiTheme, { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import React, { useContext } from 'react'
import { PersonalSettingsContext } from './PersonalSettingsContext'
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
  const ps = useContext(PersonalSettingsContext)
  const theme = mergeThemes(props.theme, ps.theme)
  return (
    <MuiThemeProvider theme={theme}>
      <ThemeContext.Provider value={theme}>{props.children}</ThemeContext.Provider>
    </MuiThemeProvider>
  )
}

const extendedComponent = ThemeProviderComponent

export { extendedComponent as ThemeProvider }
