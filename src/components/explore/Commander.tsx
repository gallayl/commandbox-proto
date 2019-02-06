import React from 'react'
import ExploreComponent from './index'

export const Commander: React.StatelessComponent = () => {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <ExploreComponent style={{ flexGrow: 1, flexShrink: 0, maxHeight: '100%' }} />
      <ExploreComponent
        style={{ flexGrow: 1, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.3)', maxHeight: '100%' }}
      />
    </div>
  )
}

export default Commander
