import { Injectable } from '@furystack/inject'
import { GenericContent } from '@sensenet/default-content-types'

@Injectable()
export class ContentRouteProvider {
  public primaryAction<T extends GenericContent>(content: T) {
    if (content.IsFolder) {
      return `/commander/${content.Id}`
    }
    if (content.Type === 'File') {
      return `/preview/${content.Id}`
    }
    return `/edit/${content.Id}`
  }
}
