import React, { useContext } from 'react'
import { ResponsivePersonalSetttings } from '../ResponsiveContextProvider'
import Commander from './Commander'
import { Explore } from './Explore'

export const Content: React.FunctionComponent = () => {
  const personalSettings = useContext(ResponsivePersonalSetttings)

  if (personalSettings.content.browseType === 'commander') {
    return <Commander />
  } else if (personalSettings.content.browseType === 'explorer') {
    return <Explore />
  }
  return null
}

export default Content
