import { Injectable } from '@furystack/inject'
import { ConstantContent, Repository } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { CommandPaletteItem } from '../store/CommandPalette'
import { CommandProvider } from './CommandProviderManager'

@Injectable()
export class QueryCommandProvider implements CommandProvider {
  constructor(private readonly repository: Repository) {}

  public shouldExec(searchTerm: string): boolean {
    return searchTerm[0] === '+'
  }

  public async getItems(query: string): Promise<CommandPaletteItem[]> {
    const result = await this.repository.loadCollection({
      path: ConstantContent.PORTAL_ROOT.Path,
      oDataOptions: {
        query,
        top: 10,
        select: ['Id', 'Path', 'Type', 'Name', 'DisplayName', 'Icon', 'Avatar'],
      },
    })
    return result.d.results.map(
      content =>
        ({
          primaryText: content.DisplayName || content.Name,
          secondaryText: content.Path,
          avatar:
            content.Type === 'User'
              ? {
                  abbrev: content.DisplayName[0] || content.Name[0],
                  url:
                    content.Avatar &&
                    content.Avatar.Url &&
                    PathHelper.joinPaths(this.repository.configuration.repositoryUrl, content.Avatar.Url),
                }
              : undefined,
          icon: content.Icon,
        } as CommandPaletteItem),
    )
  }
}
