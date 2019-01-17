import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import {
  Toolbar,
  IconButton,
  Typography,
  MuiThemeProvider,
  createMuiTheme,
  ClickAwayListener
} from "@material-ui/core";
import { Icon } from "@sensenet/icons-react";

import logo from "./sensenet-icon-32.png";
import { CommandBox } from "./CommandBox";

interface LayoutState {
  isActive: boolean;
}

const theme = createMuiTheme({
  palette: {},
  overrides: {
    MuiList: {
      root: {
        margin: "0 !important",
        padding: "0 !important"
      }
    }
  }
});

export class Layout extends React.Component<{}, LayoutState> {
  public state: LayoutState = { isActive: false };

  public render() {
    return (
      <MuiThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
            <img src={logo} style={{ marginRight: "1em" }} />
            <Typography variant="h6" color="inherit">
              Sensenet
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => this.setState({ isActive: !this.state.isActive })}
            >
              <Icon iconName="search" color="inherit" />
            </IconButton>
            <div style={{ width: "80%" }}>
              {this.state.isActive ? (
                <ClickAwayListener
                  onClickAway={() => this.setState({ isActive: false })}
                >
                  <CommandBox
                    onSelect={() => this.setState({ isActive: false })}
                  />
                </ClickAwayListener>
              ) : null}
            </div>
          </Toolbar>
        </AppBar>
      </MuiThemeProvider>
    );
  }
}
