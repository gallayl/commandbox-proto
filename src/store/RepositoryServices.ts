import { Injector } from '@furystack/inject'
import { Repository } from '@sensenet/client-core'
import { EventHub } from '@sensenet/repository-events'
import { RepositoryConfiguration } from '@sensenet/client-core/dist/Repository/RepositoryConfiguration'
import { Store } from 'redux'
import { subscribeEventsToStore } from './RepositoryEventActions'
import { store } from '.'
import { setCurrentUser, setLoginState, setGroups } from './Session'
import { FormsAuthenticationService } from '../services/FormsAuthenticationService'

export const setupRepositoryServices = async (options: {
  injector: Injector
  repositoryConfig?: Partial<RepositoryConfiguration>
  store: Store
}) => {
  const repo = new Repository(options.repositoryConfig)
  FormsAuthenticationService.Setup(repo, {
    select: "all"
  })
  options.injector.SetInstance(repo)
  const eventHub = new EventHub(repo)

  repo.authentication.currentUser.subscribe(async u => {
    store.dispatch(setGroups([]));
    store.dispatch(setCurrentUser(u))
    const groups = await repo.security.getParentGroups({
      contentIdOrPath: u.Id,
      directOnly: false,
      oDataOptions: {
        select: ['Name'],
      },
    })
    store.dispatch(setGroups(groups.d.results))

  }, true)
  repo.authentication.state.subscribe(state => store.dispatch(setLoginState(state)), true)
  subscribeEventsToStore(store, eventHub)
}
