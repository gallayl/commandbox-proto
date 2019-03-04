import React, { useContext } from 'react'
import { PersonalSettingsContext } from '../PersonalSettingsContext'
import Commander from './Commander'
import { Explore } from './Explore'

export const Content: React.FunctionComponent = () => {
  const personalSettings = useContext(PersonalSettingsContext)

  if (personalSettings.content.browseType === 'commander') {
    return <Commander />
  } else if (personalSettings.content.browseType === 'explorer') {
    return <Explore />
  }
  return null
}

export default Content
