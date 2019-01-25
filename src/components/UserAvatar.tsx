import React from 'react'
import Avatar, { AvatarProps } from '@material-ui/core/Avatar'
import { User } from '@sensenet/default-content-types'
import { PathHelper } from '@sensenet/client-utils';

export const UserAvatar: React.StatelessComponent<{ user: User, repositoryUrl: string } & AvatarProps> = props => {
  const { user, repositoryUrl, ...avatarProps } = props
  return <Avatar src={props.user.Avatar && PathHelper.joinPaths(props.repositoryUrl, props.user.Avatar.Url)} {...avatarProps} />
}
