import { Injector } from '@furystack/inject'
import React from 'react'

export const withInjector = <P extends { injector: Injector }>(
  Component: React.ComponentType<P>,
  injector = Injector.Default,
) =>
  class WithInjector extends React.Component<Pick<P, Exclude<keyof P, 'injector'>>> {
    public render() {
      return <Component injector={injector} {...this.props as any} />
    }
  }
