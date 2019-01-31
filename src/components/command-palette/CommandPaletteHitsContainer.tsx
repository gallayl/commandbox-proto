import { RenderSuggestionsContainerParams } from "react-autosuggest";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import React from "react";

export const CommandPaletteHitsContainer: React.FunctionComponent<RenderSuggestionsContainerParams & {width: number}> = options => (
    <Paper
      square={true}
      style={{
        position: 'fixed',
        zIndex: 1,
        width: options.width,
      }}>
      <List component="nav" {...options.containerProps} style={{ padding: 0 }}>
        {options.children}
      </List>
    </Paper>
  )