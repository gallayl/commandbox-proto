import { ConstantContent, ODataCollectionResponse, ODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { Reducer } from 'react'
import { AnyAction } from 'redux'
import { IInjectableActionCallbackParams } from 'redux-di-middleware'
import { rootStateType } from '.'
import { createAction, isFromAction } from './ActionHelpers'

export const init = createAction(() => ({
  type: 'EXPLORE_INIT',
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    options.dispatch(loadParent(ConstantContent.PORTAL_ROOT.Path))
  },
}))

export const loadParent = createAction((path: string) => ({
  type: 'EXPLORE_SET_PARENT',
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    const repo = options.getInjectable(Repository)
    const exploreState = options.getState().explore
    const parentPromise = await repo.load({
      idOrPath: path,
      oDataOptions: exploreState.parentLoadOptions,
    })
    const childrenPromise = await repo.loadCollection({
      path,
      oDataOptions: exploreState.childrenLoadOptions,
    })

    const ancestorsPromise = await repo.executeAction<undefined, ODataCollectionResponse<GenericContent>>({
      idOrPath: path,
      method: 'GET',
      name: 'Ancestors',
      body: undefined,
      oDataOptions: exploreState.ancestorsLoadOptions,
    })
    const [parentResponse, childrenResponse, ancestorsResponse] = await Promise.all([
      parentPromise,
      childrenPromise,
      ancestorsPromise,
    ])
    options.dispatch(setContext(parentResponse.d, childrenResponse.d.results, ancestorsResponse.d.results))
  },
}))

export const setContext = createAction(
  (parent: GenericContent, children: GenericContent[], ancestors: GenericContent[]) => ({
    type: 'EXPLORE_SET_CONTEXT',
    parent,
    children,
    ancestors,
  }),
)

export interface ExploreStateType {
  parent: GenericContent
  children: GenericContent[]
  ancestors: GenericContent[]
  parentLoadOptions: ODataParams<GenericContent>
  childrenLoadOptions: ODataParams<GenericContent>
  ancestorsLoadOptions: ODataParams<GenericContent>
}

export const defaultExploreState: ExploreStateType = {
  parent: ConstantContent.PORTAL_ROOT,
  children: [],
  ancestors: [],
  parentLoadOptions: {},
  childrenLoadOptions: {},
  ancestorsLoadOptions: {},
}

export const explore = (state: ExploreStateType = defaultExploreState, action: AnyAction) => {
  if (isFromAction(action, setContext)) {
    return {
      ...state,
      parent: action.parent,
      children: action.children,
      ancestors: action.ancestors,
    }
  }
  return state
}
