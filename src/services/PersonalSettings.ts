import { Injectable } from '@furystack/inject'
import { Repository } from '@sensenet/client-core'
import { ObservableValue } from '@sensenet/client-utils'

const settingsKey = `SN-ADMIN-USER-SETTINGS`

export interface PersonalSettingType {
  content: { browseType: 'explorer' | 'commander' }
  commandPalette: { enabled: boolean; wrapQuery: string }
  drawer: {
    enabled: boolean
    items: string[]
  }
}

export const defaultSettings: PersonalSettingType = {
  content: {
    browseType: 'explorer',
  },
  drawer: {
    enabled: true,
    items: ['Setup'],
  },
  commandPalette: { enabled: true, wrapQuery: '${0} .AUTOFILTERS:OFF' },
}

@Injectable()
export class PersonalSettings {
  constructor(private readonly repository: Repository) {
    this.repository.authentication.currentUser.subscribe(() => this.init(), true)
  }

  private async init() {
    const currentUserSettings = await this.getUserSettingsValue()
    this.currentValue.setValue({
      ...defaultSettings,
      ...currentUserSettings,
    })
  }

  public async getUserSettingsValue(): Promise<Partial<PersonalSettingType>> {
    try {
      return JSON.parse(localStorage.getItem(settingsKey) as string)
    } catch {
      /** */
    }
    return {}
  }

  public currentValue = new ObservableValue<PersonalSettingType>(defaultSettings)

  public async setValue(settings: PersonalSettingType) {
    this.currentValue.setValue(settings)
    localStorage.setItem(settingsKey, JSON.stringify(settings))
  }
}
