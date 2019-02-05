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
    options.dispatch(loadParent(ConstantContent.PORTAL_ROOT.Id))
  },
}))

const loadLock = new Semaphore(1)

export const loadParent = createAction((id: number) => ({
  type: 'EXPLORE_SET_PARENT',
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    try {
      await loadLock.acquire()
      const exploreState = options.getState().explore
      if (exploreState.parent.Id === id) {
        return
      }

      const repo = options.getInjectable(Repository)
      const parentResponse = await repo.load({
        idOrPath: id,
        oDataOptions: exploreState.parentLoadOptions,
      })
      const childrenPromise = repo.loadCollection({
        path: parentResponse.d.Path,
        oDataOptions: exploreState.childrenLoadOptions,
      })

      const ancestorsPromise = repo.executeAction<undefined, ODataCollectionResponse<GenericContent>>({
        idOrPath: parentResponse.d.Path,
        method: 'GET',
        name: 'Ancestors',
        body: undefined,
        oDataOptions: exploreState.ancestorsLoadOptions,
      })
      const [childrenResponse, ancestorsResponse] = await Promise.all([childrenPromise, ancestorsPromise])
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
  childrenLoadOptions: {
    select: ['IsFolder'],
  },
  ancestorsLoadOptions: {
    orderby: [['Path', 'asc']],
  },
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
