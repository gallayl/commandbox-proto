import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import { AuthorizedLink } from "../AuthorizedLink";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import React from "react";

export interface DrawerItem {
    primaryText: string;
    secondaryText: string;
    url: string
    icon: JSX.Element
    authorize: ()=>boolean
}

export interface DesktopDrawerProps {
    width: number
    items: Array<DrawerItem | JSX.Element>
}

const isReactElement = (element: any) : element is JSX.Element => {
    return React.isValidElement(element);
}

export const DesktopDrawer: React.StatelessComponent<DesktopDrawerProps> = (props) => 
    <Drawer variant="permanent" style={{flexShrink: 0, witdh: props.width}}>
    <div style={{height: "64px"}} />
    <List style={{width: props.width}} >
    {props.items.map(item=>
        isReactElement(item) ? item :
        <AuthorizedLink authorize={item.authorize} to={item.url} style={{textDecoration: 'none'}} key={item.primaryText}>
            <ListItem button>
                <ListItemIcon>
                    {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.primaryText} secondary={item.secondaryText} />
            </ListItem>
        </AuthorizedLink>
    )}    
    </List>
    
</Drawer>