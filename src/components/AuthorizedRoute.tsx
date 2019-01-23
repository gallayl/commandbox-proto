import { Route, RouteProps } from "react-router-dom";
import React from "react";

interface AuthorizedRouteProps extends RouteProps {
    authorize: () => boolean
    unauthorizedComponent?: JSX.Element
}

export const AuthorizedRoute: React.StatelessComponent<AuthorizedRouteProps>
= (props) => props.authorize() ? <Route {...props} /> : props.unauthorizedComponent || null