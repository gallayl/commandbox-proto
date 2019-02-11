import { Injector } from '@furystack/inject'
import React, { useEffect, useState } from 'react'
import { PersonalSettings } from '../../services/PersonalSettings'
import { withInjector } from '../withInjector'
import Commander from './Commander'
import { Explore } from './Explore'

export const Content: React.FunctionComponent<{ injector: Injector }> = props => {
  const [viewType, setViewType] = useState('')
  const service = props.injector.GetInstance(PersonalSettings)
  useEffect(() => {
    const subscription = service.currentValue.subscribe(v => {
      setViewType(v.content.browseType)
    }, true)
    return () => subscription.dispose()
  }, [])

  if (viewType === 'commander') {
    return <Commander />
  } else if (viewType === 'explorer') {
    return <Explore />
  }
  return null
}

export default withInjector(Content)
