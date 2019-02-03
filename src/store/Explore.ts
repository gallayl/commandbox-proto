import { ConstantContent, ODataCollectionResponse, ODataParams, Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { AnyAction } from 'redux'
import { IInjectableActionCallbackParams } from 'redux-di-middleware'
import Semaphore from 'semaphore-async-await'
import { rootStateType } from '.'
import { createAction, isFromAction } from './ActionHelpers'

export const init = createAction(() => ({
  type: 'EXPLORE_INIT',
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    options.dispatch(loadParent(ConstantContent.PORTAL_ROOT.Path))
  },
}))

const loadLock = new Semaphore(1)

export const loadParent = createAction((path: string) => ({
  type: 'EXPLORE_SET_PARENT',
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    try {
      await loadLock.acquire()
      const exploreState = options.getState().explore
      if (exploreState.parent.Path === path) {
        return
      }

      const repo = options.getInjectable(Repository)
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
    } finally {
      loadLock.release()
    }
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

export const select = createAction((selection: GenericContent[]) => ({
  type: 'EXPLORE_SELECT',
  selection,
}))

export interface ExploreStateType {
  isInitialized: boolean
  selected: GenericContent[]
  parent: GenericContent
  children: GenericContent[]
  ancestors: GenericContent[]

  parentLoadOptions: ODataParams<GenericContent>
  childrenLoadOptions: ODataParams<GenericContent>
  ancestorsLoadOptions: ODataParams<GenericContent>
}

export const defaultExploreState: ExploreStateType = {
  isInitialized: false,
  parent: {} as any,
  children: [],
  ancestors: [],
  selected: [],
  parentLoadOptions: {},
  childrenLoadOptions: {},
  ancestorsLoadOptions: {},
}

export const explore = (state: ExploreStateType = defaultExploreState, action: AnyAction) => {
  if (isFromAction(action, setContext)) {
    return {
      ...state,
      isInitialized: true,
      parent: action.parent,
      children: action.children,
      ancestors: action.ancestors,
    }
  }
  if (isFromAction(action, select)) {
    return {
      ...state,
      selected: action.selection,
    }
  }
  return state
}
