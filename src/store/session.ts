import { User, Group } from '@sensenet/default-content-types'
import { LoginState, ConstantContent, Repository } from '@sensenet/client-core'
import { Reducer, AnyAction } from 'redux'
import { rootStateType } from '.'
import { IInjectableActionCallbackParams } from 'redux-di-middleware'
import { createAction, isFromAction } from './ActionHelpers'
import { isExtendedError } from '@sensenet/client-core/dist/Repository/Repository';

export interface SessionReducerType {
  loginState: LoginState
  currentUser: User
  groups: Group[]
}

export const loginToRepository = createAction((username: string, password: string, repository: string) => ({
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    const repo = options.getInjectable(Repository)
    repo.configuration.repositoryUrl = repository
    await repo.authentication.login(username, password)
  },
  type: 'LOGIN_TO_REPOSITORY',
}))


export const logoutFromRepository = createAction(() => ({
  inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
    const repo = options.getInjectable(Repository)
    try {
      await repo.authentication.logout()
    } catch (error) {
      if (isExtendedError(error)){
        if (!error.response.ok){
          throw error;
        }
      }
    }
  },
  type: 'LOGOUT_FROM_REPOSITORY',
}))

export const setCurrentUser = createAction((user: User) => ({
  user,
  type: 'setCurrentUser',
}))

export const setGroups = createAction((groups: Group[]) => ({
  groups,
  type: 'setGroups',
}))

export const setLoginState = createAction((state: LoginState) => ({
  state,
  type: 'setLoginState',
}))

export const session: Reducer<SessionReducerType, AnyAction> = (
  state = {
    loginState: LoginState.Unknown,
    currentUser: ConstantContent.VISITOR_USER,
    groups: [],
  },
  action: AnyAction,
) => {
  if (isFromAction(action, setCurrentUser)) {
    return {
      ...state,
      currentUser: action.user,
    }
  } else if (isFromAction(action, setLoginState)) {
    return {
      ...state,
      loginState: action.state,
    }
  } else if (isFromAction(action, setGroups)) {
    return {
      ...state,
      groups: action.groups,
    }
  }

  return state
}
