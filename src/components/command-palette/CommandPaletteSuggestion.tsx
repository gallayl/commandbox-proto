import Avatar from '@material-ui/core/Avatar'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import React from 'react'
import { RenderSuggestionParams } from 'react-autosuggest'
import { CommandPaletteItem } from '../../store/CommandPalette'
import { CommandPaletteIcon } from './CommandPaletteIcon'

export const getMatchParts = (text: string, term: string) => {
  const matchValue = match(term, text)
  const parseValue = parse(term, matchValue)

  return parseValue.map((part, index) =>
    part.highlight ? <strong key={String(index)}>{part.text}</strong> : <span key={String(index)}>{part.text}</span>,
  )
}

export const CommandPaletteSuggestion: React.FunctionComponent<{
  suggestion: CommandPaletteItem
  params: RenderSuggestionParams
}> = ({ suggestion, params }) => (
  <ListItem button={true} selected={params.isHighlighted}>
    {suggestion.avatar ? (
      <ListItemAvatar>
        <Avatar src={suggestion.avatar.url}>{suggestion.avatar.abbrev}</Avatar>
      </ListItemAvatar>
    ) : null}
    {!suggestion.avatar && suggestion.icon ? (
      <ListItemIcon style={{ margin: '0 8px' }}>
        <CommandPaletteIcon />
      </ListItemIcon>
    ) : null}
    <ListItemText
      primary={getMatchParts(params.query, suggestion.primaryText)}
      secondary={getMatchParts(params.query, suggestion.secondaryText)}
    />
  </ListItem>
)
