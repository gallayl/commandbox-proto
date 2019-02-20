import React, { useContext, useEffect, useState } from 'react'
import { PersonalSettings } from '../../services/PersonalSettings'
import { InjectorContext } from '../InjectorContext'
import Commander from './Commander'
import { Explore } from './Explore'

export const Content: React.FunctionComponent = () => {
  const [viewType, setViewType] = useState('')
  const injector = useContext(InjectorContext)
  const service = injector.GetInstance(PersonalSettings)
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

export default Content
