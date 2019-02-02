import { CommandProvider } from './CommandProviderManager'
import { CommandPaletteItem } from '../store/CommandPalette'
import { Injectable } from '@furystack/inject'

@Injectable()
export class HelpCommandProvider implements CommandProvider {
  public shouldExec(term: string) {
    return term === '?' || term === 'help'
  }

  public async getItems(_term: string): Promise<Array<CommandPaletteItem>> {
    return [
      {
        primaryText: 'Help Item 1',
        secondaryText: 'HelpItemke Eggggy',
      },
    ]
  }
}
