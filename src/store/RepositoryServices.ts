import { Injector } from '@furystack/inject'
import { FormsAuthenticationService, Repository } from '@sensenet/client-core'
import { RepositoryConfiguration } from '@sensenet/client-core/dist/Repository/RepositoryConfiguration'
import { EventHub } from '@sensenet/repository-events'
import { Store } from 'redux'
import { store } from '.'
import { CommandProviderManager } from '../services/CommandProviderManager'
import { CheatCommandProvider } from '../services/CommandProviders/CheatCommandProvider'
import { HelpCommandProvider } from '../services/CommandProviders/HelpCommandProvider'
import { HistoryCommandProvider } from '../services/CommandProviders/HistoryCommandProvider'
import { InFolderSearchCommandProvider } from '../services/CommandProviders/InFolderSearchCommandProvider'
import { QueryCommandProvider } from '../services/CommandProviders/QueryCommandProvider'
import { getViewerSettings } from '../services/GetViewerSettings'
import { subscribeEventsToStore } from './RepositoryEventActions'
import { setCurrentUser, setGroups, setLoginState } from './Session'

export const setupRepositoryServices = async (options: {
  injector: Injector
  repositoryConfig?: Partial<RepositoryConfiguration>
  store: Store
}) => {
  const repo = new Repository(options.repositoryConfig)
  repo.reloadSchema()
  FormsAuthenticationService.Setup(repo, {
    select: 'all',
  })
  options.injector.SetInstance(repo)

  const viewerSettings = getViewerSettings(repo)
  options.injector.SetInstance(viewerSettings)

  const eventHub = new EventHub(repo)

  const commandProviderManager = options.injector.GetInstance(CommandProviderManager)
  commandProviderManager.RegisterProviders(
    QueryCommandProvider,
    HistoryCommandProvider,
    HelpCommandProvider,
    InFolderSearchCommandProvider,
    CheatCommandProvider,
  )
  repo.authentication.currentUser.subscribe(async u => {
    store.dispatch(setGroups([]))
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
