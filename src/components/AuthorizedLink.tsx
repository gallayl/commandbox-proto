import { LinkProps, Link } from "react-router-dom";
import React from "react";

interface AuthorizedLinkProps extends LinkProps {
    authorize: () => boolean
}

export const AuthorizedLink: React.StatelessComponent<AuthorizedLinkProps>
= (props) => props.authorize() ? <Link {...props} /> : null