import React, { useContext } from 'react'
import MediaQuery from 'react-responsive'
import { defaultSettings } from '../services/PersonalSettings'
import { mergeDeep } from '../utils/deepMerge'
import { PersonalSettingsContext } from './PersonalSettingsContext'
import { ThemeContext } from './ThemeContext'

export type ResponsivePlatforms = 'desktop' | 'tablet' | 'mobile'

export type PlatformDependent<T> = { [key in ResponsivePlatforms]?: T } & {
  default: T
}
export const ResponsiveContext = React.createContext<ResponsivePlatforms>('desktop')
export const ResponsivePersonalSetttings = React.createContext(defaultSettings.default)

export const ResponsiveContextProvider: React.FunctionComponent = props => {
  const theme = useContext(ThemeContext)
  const personalSettings = useContext(PersonalSettingsContext)
  return (
    <div>
      <MediaQuery query={theme.breakpoints.up('lg').replace('@media ', '')}>
        <ResponsivePersonalSetttings.Provider value={mergeDeep(personalSettings.default, personalSettings.desktop)}>
          <ResponsiveContext.Provider value="desktop">{props.children}</ResponsiveContext.Provider>
        </ResponsivePersonalSetttings.Provider>
      </MediaQuery>
      <MediaQuery query={theme.breakpoints.only('md').replace('@media ', '')}>
        <ResponsivePersonalSetttings.Provider value={mergeDeep(personalSettings.default, personalSettings.tablet)}>
          <ResponsiveContext.Provider value="tablet">{props.children}</ResponsiveContext.Provider>
        </ResponsivePersonalSetttings.Provider>
      </MediaQuery>
      <MediaQuery query={theme.breakpoints.down('sm').replace('@media ', '')}>
        <ResponsivePersonalSetttings.Provider value={mergeDeep(personalSettings.default, personalSettings.mobile)}>
          <ResponsiveContext.Provider value="mobile">{props.children}</ResponsiveContext.Provider>
        </ResponsivePersonalSetttings.Provider>
      </MediaQuery>
    </div>
  )
}
