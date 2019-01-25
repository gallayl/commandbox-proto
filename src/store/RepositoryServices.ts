import { Injector } from '@furystack/inject'
import { Repository } from '@sensenet/client-core'
import { EventHub } from '@sensenet/repository-events'
import { RepositoryConfiguration } from '@sensenet/client-core/dist/Repository/RepositoryConfiguration'
import { Store } from 'redux'
import { subscribeEventsToStore } from './RepositoryEventActions'
import { store } from '.'
import { setCurrentUser, setLoginState } from './Session'
import { FormsAuthenticationService } from '../services/FormsAuthenticationService'

export const setupRepositoryServices = async (options: {
  injector: Injector
  repositoryConfig?: Partial<RepositoryConfiguration>
  store: Store
}) => {
  const repo = new Repository(options.repositoryConfig)
  FormsAuthenticationService.Setup(repo)
  options.injector.SetInstance(repo)
  const eventHub = new EventHub(repo)

  repo.authentication.currentUser.subscribe(u => store.dispatch(setCurrentUser(u)))
  repo.authentication.state.subscribe(state => store.dispatch(setLoginState(state)))
  subscribeEventsToStore(store, eventHub)
}
