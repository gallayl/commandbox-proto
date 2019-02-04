import { Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { AnyAction, Reducer } from 'redux'
import { IInjectableActionCallbackParams } from 'redux-di-middleware'
import Semaphore from 'semaphore-async-await'
import { rootStateType } from '.'
import { createAction, isFromAction } from './ActionHelpers'

export interface EditContentState<T extends GenericContent> {
  currentContent: T
}

const loadLock = new Semaphore(1)

export const loadContent = createAction((id: number) => ({
  type: 'LOAD_CONTENT_TO_EDIT',
  id,
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    try {
      await loadLock.acquire()
      if (id === options.getState().editContent.currentContent.Id) {
        return
      }

      const repo = options.getInjectable(Repository)
      const response = await repo.load({
        idOrPath: id,
        oDataOptions: {
          select: 'all',
        },
      })
      options.dispatch(setEditedContent(response.d))
    } finally {
      loadLock.release()
    }
  },
}))

export const setEditedContent = createAction((content: GenericContent) => ({
  type: 'SET_EDITED_CONTENT',
  content,
}))

export const editContent: Reducer<EditContentState<GenericContent>, AnyAction> = (
  state = { currentContent: { Id: 0 } as any },
  action,
) => {
  if (isFromAction(action, setEditedContent)) {
    return {
      ...state,
      currentContent: action.content,
    }
  }
  return state
}
