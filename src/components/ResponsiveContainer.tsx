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
          {this.props.desktop({ children: this.props.children, ...this.props.innerProps })}
        </MediaQuery>
        <MediaQuery query={theme.breakpoints.only('md').replace('@media ', '')}>
          {this.props.tablet({ children: this.props.children, ...this.props.innerProps })}
        </MediaQuery>
        <MediaQuery query={theme.breakpoints.down('sm').replace('@media ', '')}>
          {this.props.mobile({ children: this.props.children, ...this.props.innerProps })}
        </MediaQuery>
      </div>
    )
  }
}
