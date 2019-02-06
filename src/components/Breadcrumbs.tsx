import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

export interface BreadcrumbItem {
  url: string
  displayName: string
  title: string
  content: GenericContent
}

export interface BreadcrumbProps {
  content: BreadcrumbItem[]
  currentContent: BreadcrumbItem
  onItemClick: (event: React.MouseEvent, item: BreadcrumbItem) => void
}

const Breadcrumbs: React.FunctionComponent<BreadcrumbProps & RouteComponentProps> = props => (
  <Typography variant="h6" style={{ paddingLeft: '.5em' }}>
    {props.content.map((item, key) => (
      <span key={key}>
        <Tooltip title={item.title}>
          <Button onClick={ev => props.onItemClick(ev, item)}>{item.displayName}</Button>
        </Tooltip>
        <KeyboardArrowRight style={{ verticalAlign: 'middle', height: '16px' }} />
      </span>
    ))}
    <Tooltip title={props.currentContent.url}>
      <Button onClick={ev => props.onItemClick(ev, props.currentContent)}>{props.currentContent.displayName}</Button>
    </Tooltip>
  </Typography>
)

const routed = withRouter(Breadcrumbs)

export default routed
