import { createMuiTheme } from "@material-ui/core";
import zIndex from "@material-ui/core/styles/zIndex";

const theme = createMuiTheme({
    palette: {},
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
          zIndex: zIndex.drawer + 1
        }
      }
    }
  });

  export default theme