import React, { useContext } from 'react'
import MediaQuery from 'react-responsive'
import { ThemeContext } from './ThemeContext'

export type ResponsivePlatforms = 'desktop' | 'tablet' | 'mobile'

export type PlatformDependent<T> = { [key in ResponsivePlatforms]?: T } & {
  default: T
}

export const ResponsiveContext = React.createContext<ResponsivePlatforms>('desktop')

export const ResponsiveContextProvider: React.FunctionComponent = props => {
  const theme = useContext(ThemeContext)
  return (
    <div>
      <MediaQuery query={theme.breakpoints.up('lg').replace('@media ', '')}>
        <ResponsiveContext.Provider value="desktop">{props.children}</ResponsiveContext.Provider>
      </MediaQuery>
      <MediaQuery query={theme.breakpoints.only('md').replace('@media ', '')}>
        <ResponsiveContext.Provider value="tablet">{props.children}</ResponsiveContext.Provider>
      </MediaQuery>
      <MediaQuery query={theme.breakpoints.down('sm').replace('@media ', '')}>
        <ResponsiveContext.Provider value="mobile">{props.children}</ResponsiveContext.Provider>
      </MediaQuery>
    </div>
  )
}
