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
import dashboard from "./dashboard.PNG";
import maros from "./maros.png";
import { CommandBox } from "./CommandBox";
import zIndex from "@material-ui/core/styles/zIndex";

interface LayoutState {
  isActive: boolean;
  search: string;
}

const theme = createMuiTheme({
  palette: {},
  overrides: {
    MuiList: {
      root: {
        margin: "0 !important",
        padding: "0 !important"
      }
    },
    MuiAppBar: {
      root: {
        zIndex: zIndex.drawer + 1
      }
    }
  }
});

export class Layout extends React.Component<{}, LayoutState> {
  public state: LayoutState = { isActive: false, search: "" };

  /**
   *
   */
  constructor(props: Layout["props"]) {
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  public componentDidMount() {
    document.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("keydown", this.handleKeyUp);
  }

  public componentWillUnmount() {
    document.removeEventListener("keyup", this.handleKeyUp);
    document.removeEventListener("keydown", this.handleKeyUp);
  }

  private handleKeyUp(ev: KeyboardEvent) {
    if (ev.key.toLowerCase() === "p" && ev.ctrlKey) {
      ev.stopImmediatePropagation();
      ev.preventDefault();
      if (ev.shiftKey) {
        this.setState({ search: ">", isActive: true });
      } else {
        this.setState({ search: "", isActive: true });
      }
    } else {
      if (ev.key === "Escape") {
        this.setState({ isActive: false });
      }
    }
  }

  public render() {
    return (
      <MuiThemeProvider theme={theme}>
        <AppBar position="fixed" style={{ backgroundColor: "#363636" }}>
          <Toolbar style={{}}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <img src={logo} style={{ marginRight: "1em" }} />
              <Typography variant="h6" color="inherit">
                Sensenet
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexGrow: 1,
                marginLeft: "2em"
              }}
            >
              <IconButton
                color="inherit"
                style={{
                  opacity: this.state.isActive ? 0 : 1,
                  transition: "opacity ease-in-out .3s"
                }}
                onClick={() =>
                  this.setState({ isActive: !this.state.isActive })
                }
              >
                <Icon iconName="search" color="inherit" />
              </IconButton>
              <div style={{ width: "100%" }}>
                {this.state.isActive ? (
                  <ClickAwayListener
                    onClickAway={() => this.setState({ isActive: false })}
                  >
                    <CommandBox
                      search={this.state.search}
                      onDismiss={() =>
                        this.setState({ isActive: false, search: "" })
                      }
                    />
                  </ClickAwayListener>
                ) : null}
              </div>
            </div>
            <div
              style={{
                overflow: "hidden",
                borderRadius: "50%",
                width: "64px",
                height: "64px",
                boxShadow: "0px 0px 8px black"
              }}
            >
              <div
                style={{
                  marginLeft: "2em",
                  display: "flex",
                  flexDirection: "row-reverse"
                }}
              >
                <img src={maros} style={{ height: "64px" }} />
              </div>
            </div>
          </Toolbar>
        </AppBar>
        <div>
          <img src={dashboard} style={{ marginTop: "64px" }} />
        </div>
      </MuiThemeProvider>
    );
  }
}
