import { LoginState } from '@sensenet/client-core'
import React from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { rootStateType } from '../store'
import { AuthorizedRoute } from './AuthorizedRoute'
import { Dashboard } from './dashboard'
import { Explore } from './explore'
import { Iam } from './iam'
import { Login } from './Login'
import { Search } from './search'
import { Setup } from './setup'

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
