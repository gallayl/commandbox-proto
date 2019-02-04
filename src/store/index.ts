import { Injector } from '@furystack/inject'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { ReduxDiMiddleware } from 'redux-di-middleware'
import { commandPalette } from './CommandPalette'
import { drawer } from './Drawer'
import { editContent } from './EditContent'
import { explore } from './Explore'
import { loadedContentCache } from './LoadedContentCache'
import { persistedState } from './PersistedState'
import { setupRepositoryServices } from './RepositoryServices'
import { session } from './Session'

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const rootReducer = combineReducers({
  session,
  drawer,
  persistedState,
  loadedContentCache,
  commandPalette,
  explore,
  editContent,
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
