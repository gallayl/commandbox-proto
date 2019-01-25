import { createMuiTheme } from "@material-ui/core";
import zIndex from "@material-ui/core/styles/zIndex";

const theme = createMuiTheme({
    palette: {
      type: "dark",
    },
    typography: {
      useNextVariants: true,
    },
    overrides: {
      MuiList: {
        root: {
          margin: "0 !important",
          padding: "0 !important"
        }
      },
      MuiAppBar: {
        root: {
          zIndex: zIndex.drawer + 1,
          backgroundColor: "#2a2a2a !important"
        }
      }
    }
  });

  export default theme