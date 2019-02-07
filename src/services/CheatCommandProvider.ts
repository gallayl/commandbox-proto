import { Injectable } from '@furystack/inject'
import { CommandPaletteItem } from '../store/CommandPalette'
import { CommandProvider } from './CommandProviderManager'

@Injectable()
export class CheatCommandProvider implements CommandProvider {
  public items: Record<string, CommandPaletteItem> = {
    iddqd: {
      primaryText: 'GOD MODE ON',
      secondaryText: '',
      url: 'https://classicreload.com/dosx-doom.html',
    },
    'pot of gold': {
      primaryText: 'cheat enabled you wascally wabbit',
      secondaryText: 'now take a screenshot and go talk to your line manager',
      url: 'https://www.myabandonware.com/game/warcraft-orcs-humans-250/play-250',
    },
  }

  public shouldExec(term: string) {
    return Object.keys(this.items).indexOf(term) !== -1
  }
  public async getItems(term: string): Promise<CommandPaletteItem[]> {
    return (this.items as any)[term]
  }
}
