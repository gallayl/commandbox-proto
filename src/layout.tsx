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
  }

  public componentWillUnmount() {
    document.removeEventListener("keyup", this.handleKeyUp);
  }

  private handleKeyUp(ev: KeyboardEvent) {
    if (ev.key.toLowerCase() === "p" && ev.altKey) {
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
        <AppBar position="static" style={{ backgroundColor: "#363636" }}>
          <Toolbar>
            <img src={logo} style={{ marginRight: "1em" }} />
            <Typography variant="h6" color="inherit">
              Sensenet
            </Typography>
            <IconButton
              color="inherit"
              style={{
                opacity: this.state.isActive ? 0 : 1,
                transition: "opacity ease-in-out .3s"
              }}
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
                    search={this.state.search}
                    onDismiss={() =>
                      this.setState({ isActive: false, search: "" })
                    }
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
