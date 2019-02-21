import { Injectable } from '@furystack/inject'
import { GenericContent } from '@sensenet/default-content-types'

@Injectable()
export class ContentRouteProvider {
  public primaryAction<T extends GenericContent>(content: T) {
    if (content.IsFolder) {
      return `/commander/${content.Id}`
    }
    if (
      (content.Type === 'File' || content.Type === 'Image') &&
      (content as any).Binary.__mediaresource.content_type !== 'application/x-javascript' &&
      (content as any).Binary.__mediaresource.content_type !== 'text/css'
    ) {
      return `/preview/${content.Id}`
    }
    return `/edit/${content.Id}`
  }
}
