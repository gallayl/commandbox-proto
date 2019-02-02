import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { ReduxDiMiddleware } from 'redux-di-middleware'
import { session } from './Session'
import { Injector } from '@furystack/inject'
import { setupRepositoryServices } from './RepositoryServices'
import { drawer } from './Drawer'
import { persistedState } from './PersistedState'
import { loadedContentCache } from './LoadedContentCache'
import { commandPalette } from './CommandPalette'

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const rootReducer = combineReducers({
  session,
  drawer,
  persistedState,
  loadedContentCache,
  commandPalette,
})
export type rootStateType = ReturnType<typeof rootReducer>
export const diMiddleware = new ReduxDiMiddleware(Injector.Default)

const persistedStateFromStorage = localStorage.getItem('sensenet-admin')
const persistedStateParsed = persistedStateFromStorage
  ? { persistedState: persistedStateFromStorage && JSON.parse(persistedStateFromStorage) }
  : {}

export const store = createStore(
  rootReducer,
  persistedStateParsed,
  composeEnhancers(applyMiddleware(diMiddleware.getMiddleware())),
)

setupRepositoryServices({
  store,
  injector: Injector.Default,
  repositoryConfig: {
    sessionLifetime: 'expiration',
    repositoryUrl: 'https://dmsservice.demo.sensenet.com',
  },
})
