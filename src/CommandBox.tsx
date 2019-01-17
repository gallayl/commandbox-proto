import React from "react";
import Autosuggest, { InputProps } from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import maros from "./maros.png";
import {
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  ListItemSecondaryAction,
  IconButton,
  Typography
} from "@material-ui/core";
import { Icon, iconType } from "@sensenet/icons-react";

interface CommandBoxState {
  value: string;
  suggestions: Hit[];
}

interface Hit {
  primaryText: string;
  secondaryText: string;
  additionalComponent?: JSX.Element;
  icon?: JSX.Element;
  secondaryAction?: JSX.Element;
}

const createHitsForRoute = (
  path: string,
  icon: { type: iconType; name: string; icon?: JSX.Element } = {
    type: iconType.materialui,
    name: "insert_drive_file"
  }
) => {
  const segments = path.split("/");
  const secondaryAction = (
    <IconButton
      title="Open in new window"
      onClick={ev => {
        ev.preventDefault();
        ev.stopPropagation();
        alert(
          "Congratulations! You've triggered the secondary action successfully!"
        );
      }}
    >
      <Icon iconName="open_in_new" type={iconType.materialui} />
    </IconButton>
  );
  const lastSegment = segments[segments.length - 1];
  return [
    {
      primaryText: lastSegment,
      secondaryText: path,
      icon: icon.icon || <Icon iconName={icon.name} type={icon.type} />,
      secondaryAction
    },
    ...segments.slice(0, segments.length - 2).map(
      (_s, index) =>
        ({
          primaryText: _s,
          secondaryText: segments.slice(0, index + 1).join("/"),
          icon: <Icon iconName="folder" />,
          secondaryAction
        } as Hit)
    )
  ] as Hit[];
};

const hits: Hit[] = [
  {
    primaryText: "?",
    secondaryText: "ÉN LESZEK A HELP. Gratulálok hogy megnyitottál",
    icon: <Icon iconName="help" type={iconType.materialui} />
  },
  {
    primaryText: ">",
    secondaryText: "ÉN LESZEK A Command Palette. Gratulálok hogy megnyitottál",
    icon: <Icon iconName="thumb_up_alt" type={iconType.materialui} />
  },
  {
    primaryText: "TypeIs: InTree:",
    secondaryText:
      "Egy content query-t kezdtél el gépelni ami szintén működni fog és örülünk.",
    icon: <Icon iconName="find_in_page" type={iconType.materialui} />
  },
  ...createHitsForRoute("Root", { type: iconType.materialui, name: "public" }),
  ...createHitsForRoute("Root/IMS", {
    type: iconType.materialui,
    name: "domain"
  }),
  ...createHitsForRoute("Root/IMS/Builtin/Portal/Admin", {
    type: iconType.materialui,
    name: "person"
  }),
  ...createHitsForRoute("Root/IMS/Builtin/Portal/Maros", {
    type: iconType.materialui,
    name: "person",
    icon: (
      <div
        style={{
          overflow: "hidden",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
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
          <img src={maros} style={{ height: "30px" }} />
        </div>
      </div>
    )
  }),
  ...createHitsForRoute("Root/System/Settings/PortalSettings.settings", {
    type: iconType.materialui,
    name: "code"
  }),
  ...createHitsForRoute("Root/Workspaces/Document/Almafa/Alma.txt"),
  ...createHitsForRoute("Root/Workspaces/Document/Almafa/Idared.psd"),
  ...createHitsForRoute("Root/Workspaces/Document/Almafa/Birsalma.xls"),
  ...createHitsForRoute("Root/Workspaces/Document/Almafa/Jonatánka.txt")
].filter(
  (a, index, arr) =>
    arr.findIndex(v => a.primaryText === v.primaryText) === index
);

const renderSuggestion = (
  suggestion: Hit,
  options: { query: string; isHighlighted: boolean }
) => {
  const matchesPrimary = match(suggestion.primaryText, options.query);
  const partsPrimary = parse(suggestion.primaryText, matchesPrimary);

  const matchesSecondary = match(suggestion.secondaryText, options.query);
  const partsSecondary = parse(suggestion.secondaryText, matchesSecondary);

  return (
    <ListItem button selected={options.isHighlighted} component="div">
      {suggestion.icon ? <ListItemIcon>{suggestion.icon}</ListItemIcon> : null}
      <ListItemText
        inset
        primary={partsPrimary.map((part, index) =>
          part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          )
        )}
        secondary={partsSecondary.map((part, index) =>
          part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          )
        )}
      />
      {suggestion.secondaryAction ? (
        <ListItemSecondaryAction style={{ paddingRight: "1rem" }}>
          {suggestion.secondaryAction}
        </ListItemSecondaryAction>
      ) : null}
      {suggestion.additionalComponent ? suggestion.additionalComponent : null}
    </ListItem>
  );
};

function renderInputComponent(inputProps: InputProps<Hit>) {
  const {
    classes,
    inputRef = () => {},
    ref,
    defaultValue,
    onChange,
    ...other
  } = inputProps;

  return (
    <TextField
      fullWidth
      variant="outlined"
      style={{ backgroundColor: "rgba(255,255,255,.10)" }}
      InputProps={{
        style: { color: "white" },
        inputRef: node => {
          ref(node);
          inputRef(node);
        }
      }}
      defaultValue={defaultValue as string}
      onChange={onChange as any}
      {...other}
    />
  );
}

const getSuggestions = (value: string) => {
  const inputValue = value.trim().toLowerCase();
  const normalizedInputValue = inputValue.replace(/[^\w\s]/gi, "");
  const inputLength = inputValue.length;

  return inputLength === 0
    ? [
        {
          primaryText: "barack.docx",
          secondaryText: "Root/Workspaces/DocLib666/Folderke",
          icon: <Icon iconName="insert_drive_file" />,
          secondaryAction: (
            <div>
              <Typography color="textSecondary">
                <a href="#">recently opened</a>
              </Typography>
            </div>
          )
        },
        {
          primaryText: "PortalSettings.json",
          secondaryText: "Root/System/Settings",
          icon: <Icon iconName="settings" />,
          secondaryAction: (
            <div>
              <Typography color="textSecondary">
                <a href="#">recently updated</a>
              </Typography>
            </div>
          )
        }
      ]
    : hits
        .filter(
          hit =>
            hit.primaryText.toLowerCase().includes(inputValue) ||
            hit.secondaryText.toLowerCase().includes(inputValue)
        )
        .map(hit => {
          return {
            ...hit,
            value:
              +(
                hit.primaryText
                  .toLowerCase()
                  .match(new RegExp(normalizedInputValue, "g")) || []
              ).length +
              (
                hit.secondaryText
                  .toLowerCase()
                  .match(new RegExp(normalizedInputValue, "g")) || []
              ).length +
              (hit.primaryText.toLowerCase() === inputValue ? 100 : 0) +
              (hit.secondaryText.toLowerCase() === inputValue ? 100 : 0)
          };
        })
        .sort((a, b) => {
          if (a.value < b.value) {
            return 1;
          }
          if (a.value > b.value) {
            return -1;
          }
          return 0;
        });
};

const getSuggestionValue = (suggestion: Hit) => suggestion.primaryText;

export class CommandBox extends React.Component<
  { onDismiss: () => void; search: string },
  CommandBoxState
> {
  public state: CommandBoxState = { value: this.props.search, suggestions: [] };

  public onChange = (
    _event: React.SyntheticEvent,
    change: { newValue: string; method: "click" | "type" | "enter" }
  ) => {
    if (change.method === "click" || change.method === "enter") {
      alert(`Congratulation! You've selected '${change.newValue}'`);
      this.setState({
        value: ""
      });
      this.props.onDismiss();
    } else {
      this.setState({
        value: change.newValue
      });
    }
  };

  public onSuggestionsFetchRequested = (change: { value: string }) => {
    this.setState({
      suggestions: getSuggestions(change.value)
    });
  };

  public onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  public handleSubmit = (ev: React.KeyboardEvent) => {
    if (ev.key === "Enter") {
      this.onChange(ev, { newValue: this.state.value, method: "enter" });
    }
  };

  public componentDidMount() {
    setTimeout(() => {
      (document.getElementById("CommandBoxInput") as HTMLInputElement).focus();
    }, 100);
  }

  public render() {
    const { value, suggestions } = this.state;

    const inputProps: InputProps<Hit> = {
      placeholder: "Type '?' for help",
      value,
      autoFocus: true,
      onChange: this.onChange,
      id: "CommandBoxInput",
      onKeyUp: (ev: React.KeyboardEvent) => this.handleSubmit(ev)
    };

    return (
      <Autosuggest
        alwaysRenderSuggestions
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        renderInputComponent={renderInputComponent}
        renderSuggestionsContainer={options => (
          <Paper
            square
            style={{
              position: "fixed",
              width: "calc(80% - 38px)",
              overflow: "hidden"
            }}
          >
            <List
              component="nav"
              {...options.containerProps}
              style={{ padding: 0 }}
            >
              {options.children}
            </List>
          </Paper>
        )}
      />
    );
  }
}
