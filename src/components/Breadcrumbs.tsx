import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

const Breadcrumbs: React.FunctionComponent<
  { content: GenericContent[]; currentContent: GenericContent } & RouteComponentProps
> = props => (
  <Typography variant="h6" style={{ paddingLeft: '.5em' }}>
    {props.content.map(ancestor => (
      <span key={ancestor.Id}>
        <Tooltip title={ancestor.Path}>
          <Button
            onClick={() => props.history.push(ancestor.IsFolder ? `/content/${ancestor.Id}` : `/edit/${ancestor.Id}`)}
            key={ancestor.Id}>
            {ancestor.DisplayName || ancestor.Name}
          </Button>
        </Tooltip>
        <KeyboardArrowRight style={{ verticalAlign: 'middle', height: '16px' }} />
      </span>
    ))}
    <Tooltip title={props.currentContent.Path}>
      <Button>{props.currentContent.DisplayName || props.currentContent.Name}</Button>
    </Tooltip>
  </Typography>
)

const routed = withRouter(Breadcrumbs)

export default routed
