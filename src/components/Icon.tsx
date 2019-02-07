import { Injector } from '@furystack/inject'
import DeleteTwoTone from '@material-ui/icons/DeleteTwoTone'
import FolderTwoTone from '@material-ui/icons/FolderTwoTone'
import GroupTwoTone from '@material-ui/icons/GroupTwoTone'
import PublicTwoTone from '@material-ui/icons/PublicTwoTone'
import SettingsTwoTone from '@material-ui/icons/SettingsTwoTone'
import WebAssetTwoTone from '@material-ui/icons/WebAssetTwoTone'
import { Repository } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent, User } from '@sensenet/default-content-types'
import { File as SnFile } from '@sensenet/default-content-types'
import React from 'react'
import { UserAvatar } from './UserAvatar'
import { withInjector } from './withInjector'

export interface IconOptions {
  style?: React.CSSProperties
  injector: Injector
}

export interface IconResolver<T extends GenericContent = GenericContent> {
  get: (item: T, options: IconOptions) => JSX.Element | null
}

export const defaultResolvers: IconResolver[] = [
  {
    get: (item, options) =>
      item.Type === 'User' ? (
        <UserAvatar
          user={item as User}
          repositoryUrl={options.injector.GetInstance(Repository).configuration.repositoryUrl}
          style={options.style}
        />
      ) : null,
  },
  { get: (item, options) => (item.Type === 'Group' ? <GroupTwoTone style={options.style} /> : null) },
  {
    get: (item, options) =>
      item.Type === 'File' && (item as SnFile).PageCount ? (
        <img
          src={PathHelper.joinPaths(
            options.injector.GetInstance(Repository).configuration.repositoryUrl,
            item.Path,
            '/Previews',
            item.Version as string,
            'thumbnail1.png',
          )}
          style={options.style}
        />
      ) : null,
  },
  { get: (item, options) => (item.Type === 'Profiles' ? <GroupTwoTone style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'Folder' ? <FolderTwoTone style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'SystemFolder' ? <FolderTwoTone style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'TrashBin' ? <DeleteTwoTone style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'PortalRoot' ? <PublicTwoTone style={options.style} /> : null) },
  {
    get: (item, options) =>
      item.Type && item.Type.indexOf('Settings') !== -1 ? <SettingsTwoTone style={options.style} /> : null,
  },
]

export const IconComponent: React.FunctionComponent<{
  resolvers?: IconResolver[]
  item: GenericContent
  defaultIcon?: JSX.Element
  style?: React.CSSProperties
  injector: Injector
}> = props => {
  const options: IconOptions = { style: props.style, injector: props.injector }
  const resolvers = [...(props.resolvers || []), ...defaultResolvers]
  const defaultIcon = props.defaultIcon || <WebAssetTwoTone style={props.style} /> || null
  const assignedResolver = resolvers.find(r => (r.get(props.item, options) ? true : false))
  if (assignedResolver) {
    return assignedResolver.get(props.item, options) as JSX.Element
  }

  return defaultIcon
}

const wrapped = withInjector(IconComponent)

export { wrapped as Icon }
