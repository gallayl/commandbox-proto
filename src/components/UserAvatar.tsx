import React from 'react'
import Avatar, { AvatarProps } from '@material-ui/core/Avatar'
import { User } from '@sensenet/default-content-types'

export const UserAvatar: React.StatelessComponent<{ user: User } & AvatarProps> = props => {
  const { user, ...avatarProps } = props
  return <Avatar src={props.user.Avatar && props.user.Avatar.Url} {...avatarProps} />
}
