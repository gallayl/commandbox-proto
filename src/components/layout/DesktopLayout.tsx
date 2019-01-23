import React from "react"
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import User from "@material-ui/icons/Person"
import CssBaseline from '@material-ui/core/CssBaseline';

import logo from "../../assets/sensenet-icon-32.png"
import { DesktopDrawer } from "../drawer/DesktopDrawer";
import { Divider } from "@material-ui/core";

const toolbarWidth = 220

export const DesktopLayout: React.StatelessComponent = (props) => <div style={{display: 'flex'}}>
    <CssBaseline />
    <AppBar position="fixed">
        <Toolbar>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <img src={logo} style={{ marginRight: "1em", filter: "drop-shadow(0px 0px 3px black)" }} />
                    <Typography variant="h5" color="inherit">
                    SN ADMIN UI
              </Typography>
              </div>
              <div style={{flex: 1}} />
              <User />
        </Toolbar>
    </AppBar>

    <DesktopDrawer width={toolbarWidth} items={[
        {primaryText: "Alma", secondaryText: "Menüke 1", url: "/alma", icon: <User />, authorize: ()=>true},
        {primaryText: "Körte", secondaryText: "Menüke 2", url: "/korte", icon: <User />, authorize: ()=>true},
        <Divider />,
        {primaryText: "Cucc", secondaryText: "Menüke 3", url: "/cucc", icon: <User />, authorize: ()=>true},
        
    ]} />
    
    <div style={{marginTop: "64px", marginLeft: toolbarWidth}}>
        {props.children}
    </div>
</div>