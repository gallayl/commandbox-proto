import Avatar, { AvatarProps } from '@material-ui/core/Avatar'
import { PathHelper } from '@sensenet/client-utils'
import { User } from '@sensenet/default-content-types'
import React from 'react'

export const UserAvatar: React.StatelessComponent<{
  user: User
  repositoryUrl: string
  avatarProps?: AvatarProps
}> = props => {
  const { user, repositoryUrl, avatarProps } = props
  const avatarUrl = user.Avatar && user.Avatar.Url
  if (avatarUrl) {
    return <Avatar src={PathHelper.joinPaths(repositoryUrl, avatarUrl)} {...avatarProps} />
  }
  return <Avatar>{(user.DisplayName && user.DisplayName[0]) || user.Name[0]}</Avatar>
}
