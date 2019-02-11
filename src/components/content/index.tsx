import React from 'react'
import Commander from './Commander'
import { Explore } from './Explore'

export const Content: React.FunctionComponent<{ useCommander?: boolean }> = props => {
  if (props.useCommander) {
    return <Commander />
  }
  return <Explore />
}

export default Content
