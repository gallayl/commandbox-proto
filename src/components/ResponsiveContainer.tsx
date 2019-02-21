import { Theme } from '@material-ui/core/styles/createMuiTheme'
import React from 'react'
import MediaQuery from 'react-responsive'
import { ThemeContext } from './ThemeContext'
export interface ResponsiveContainerProps<TProps> {
  desktop: React.StatelessComponent<TProps>
  tablet: React.StatelessComponent<TProps>
  mobile: React.StatelessComponent<TProps>
  innerProps: TProps
}

export class ResponsiveContainer<TProps = {}> extends React.Component<ResponsiveContainerProps<TProps>> {
  public static contextType = ThemeContext

  public render() {
    const theme: Theme = this.context
    return (
      <div>
        <MediaQuery query={theme.breakpoints.up('lg').replace('@media ', '')}>
          {React.createElement(this.props.desktop, this.props.innerProps, this.props.children)}
        </MediaQuery>
        <MediaQuery query={theme.breakpoints.only('md').replace('@media ', '')}>
          {React.createElement(this.props.tablet, this.props.innerProps, this.props.children)}
        </MediaQuery>
        <MediaQuery query={theme.breakpoints.down('sm').replace('@media ', '')}>
          {React.createElement(this.props.mobile, this.props.innerProps, this.props.children)}
        </MediaQuery>
      </div>
    )
  }
}
