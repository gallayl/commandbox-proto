import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

export interface BreadcrumbItem {
  url: string
  displayName: string
  title: string
}

const Breadcrumbs: React.FunctionComponent<
  { content: BreadcrumbItem[]; currentContent: BreadcrumbItem } & RouteComponentProps
> = props => (
  <Typography variant="h6" style={{ paddingLeft: '.5em' }}>
    {props.content.map((item, key) => (
      <span key={key}>
        <Tooltip title={item.title}>
          <Button onClick={() => props.history.push(item.url)}>{item.displayName}</Button>
        </Tooltip>
        <KeyboardArrowRight style={{ verticalAlign: 'middle', height: '16px' }} />
      </span>
    ))}
    <Tooltip title={props.currentContent.url}>
      <Button>{props.currentContent.displayName}</Button>
    </Tooltip>
  </Typography>
)

const routed = withRouter(Breadcrumbs)

export default routed
