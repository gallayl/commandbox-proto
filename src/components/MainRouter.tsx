import { rootStateType } from '../store'
import { LoginState } from '@sensenet/client-core'
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import React from 'react'
import { Login } from './Login'
import { AuthorizedRoute } from './AuthorizedRoute'
import { Dashboard } from './dashboard'
import { Explore } from './explore'
import { Setup } from './setup'
import { Search } from './search'
import { Iam } from './iam'

const mapStateToProps = (state: rootStateType) => ({
  loginState: state.session.loginState,
  currentUser: state.session.currentUser,
})

const MainRouter: React.StatelessComponent<ReturnType<typeof mapStateToProps> & RouteComponentProps> = props => {
  if (props.loginState === LoginState.Unauthenticated) {
    return <Login />
  }
  return (
    <Switch>
      <AuthorizedRoute path="/content" component={Explore} authorize={() => true} />
      <AuthorizedRoute path="/search" component={Search} authorize={() => true} />
      <AuthorizedRoute path="/iam" component={Iam} authorize={() => true} />
      <AuthorizedRoute path="/setup" component={Setup} authorize={() => true} />
      <Route path="" component={Dashboard} />
    </Switch>
  )
}

const connectedComponent = withRouter(connect(mapStateToProps)(MainRouter))

export { connectedComponent as MainRouter }
