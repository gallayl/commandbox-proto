import { LoginState } from '@sensenet/client-core'
import React, { lazy, Suspense } from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { rootStateType } from '../store'
import { AuthorizedRoute } from './AuthorizedRoute'
import { ErrorBoundary } from './ErrorBoundary'
import { FullScreenLoader } from './FullScreenLoader'

const mapStateToProps = (state: rootStateType) => ({
  loginState: state.session.loginState,
  currentUser: state.session.currentUser,
})

const ExploreComponent = lazy(async () => await import(/* webpackChunkName: "explore" */ './explore'))
const DashboardComponent = lazy(async () => await import(/* webpackChunkName: "dashboard" */ './dashboard'))
const SearchComponent = lazy(async () => await import(/* webpackChunkName: "search" */ './search'))
const IamComponent = lazy(async () => await import(/* webpackChunkName: "iam" */ './iam'))
const SetupComponent = lazy(async () => await import(/* webpackChunkName: "setup" */ './setup'))

const LoginComponent = lazy(async () => await import(/* webpackChunkName: "Login" */ './Login'))
const EditComponent = lazy(async () => await import(/* webpackChunkName: "Edit" */ './Edit'))

const MainRouter: React.StatelessComponent<ReturnType<typeof mapStateToProps> & RouteComponentProps> = props => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<FullScreenLoader />}>
        {props.loginState === LoginState.Unauthenticated ? (
          <LoginComponent />
        ) : props.loginState === LoginState.Authenticated ? (
          <Switch>
            <AuthorizedRoute path="/content/:folderId?" render={() => <ExploreComponent />} authorize={() => true} />
            <AuthorizedRoute path="/search" render={() => <SearchComponent />} authorize={() => true} />
            <AuthorizedRoute path="/iam" render={() => <IamComponent />} authorize={() => true} />
            <AuthorizedRoute path="/setup" render={() => <SetupComponent />} authorize={() => true} />
            <AuthorizedRoute path="/edit/:contentId?" render={() => <EditComponent />} authorize={() => true} />
            <Route path="/" render={() => <DashboardComponent />} />
          </Switch>
        ) : (
          <FullScreenLoader />
        )}
      </Suspense>
    </ErrorBoundary>
  )
}

const connectedComponent = withRouter(connect(mapStateToProps)(MainRouter))

export { connectedComponent as MainRouter }
