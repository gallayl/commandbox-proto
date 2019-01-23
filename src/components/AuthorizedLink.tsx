import { LinkProps, Link } from "react-router-dom";
import React from "react";

interface AuthorizedLinkProps extends LinkProps {
    authorize: () => boolean
}

export const AuthorizedLink: React.StatelessComponent<AuthorizedLinkProps>
= (props) => {
    const {authorize, ...linkProps }= {...props};
    return props.authorize() ? <Link {...linkProps} /> : null
}