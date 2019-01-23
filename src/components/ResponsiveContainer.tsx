import React from "react";
import MediaQuery from "react-responsive";
import theme from "../theme";
export interface ResponsiveContainerProps<TProps> {
    desktop: React.StatelessComponent<TProps>
    tablet: React.StatelessComponent<TProps>
    mobile: React.StatelessComponent<TProps>
    innerProps: TProps
}


export class ResponsiveContainer<TProps = {}> extends React.Component<ResponsiveContainerProps<TProps>>{
    public render(){
        return <div>
        <MediaQuery query={theme.breakpoints.up("lg").replace("@media ", "")}>
         {this.props.desktop({children: this.props.children, ...this.props.innerProps})}
        </MediaQuery>
        <MediaQuery query={theme.breakpoints.only("md").replace("@media ", "")}>
        {this.props.tablet({children: this.props.children,...this.props.innerProps})}
        </MediaQuery>
        <MediaQuery query={theme.breakpoints.down("sm").replace("@media ", "")}>
        {this.props.mobile({children: this.props.children,...this.props.innerProps})}
        </MediaQuery>
        </div>
    }
}
