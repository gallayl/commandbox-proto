import { Injectable, Injector } from '@furystack/inject'
import { ConstantContent, Repository } from '@sensenet/client-core'
import { CommandPaletteItem } from '../store/CommandPalette'
import { CommandProvider } from './CommandProviderManager'
import { ContentRouteProvider } from './ContentRouteProvider'
import { GenericContent } from '@sensenet/default-content-types'

@Injectable()
export class QueryCommandProvider implements CommandProvider {
  constructor(private readonly repository: Repository, private readonly injector: Injector) {}

  public shouldExec(searchTerm: string): boolean {
    return searchTerm[0] === '+'
  }

  public async getItems(query: string): Promise<CommandPaletteItem[]> {
    const result = await this.repository.loadCollection<GenericContent>({
      path: ConstantContent.PORTAL_ROOT.Path,
      oDataOptions: {
        query,
        top: 10,
        select: 'all',
      },
    })
    return result.d.results.map(
      content =>
        ({
          primaryText: content.DisplayName || content.Name,
          secondaryText: content.Path,
          url: this.injector.GetInstance(ContentRouteProvider).primaryAction(ConstantContent.PORTAL_ROOT),
          content,
          icon: content.Icon,
        } as CommandPaletteItem),
    )
  }
}
