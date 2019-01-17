import React from "react";
import Autosuggest, { InputProps } from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
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

const hits: Hit[] = [
  {
    primaryText: "?",
    secondaryText: "Help",
    icon: <Icon iconName="help" type={iconType.materialui} />,
    additionalComponent: (
      <div style={{ display: "block", width: "100%" }}>ÉN VAGYOK A HELP</div>
    )
  },
  {
    primaryText: "alma",
    secondaryText: "Root/Workspaces/DocLib2/AlmaCollection/alma.txt",
    icon: <Icon iconName="insert_drive_file" type={iconType.materialui} />,
    secondaryAction: (
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
    )
  },
  {
    primaryText: "KÖRTE",
    secondaryText: "Root/Workspaces/Tasks/Monday",
    icon: <Icon iconName="insert_drive_file" />
  }
];

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
      style={{ backgroundColor: "rgba(255,255,255,.4)" }}
      InputProps={{
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
    : hits.filter(
        hit =>
          hit.primaryText.toLowerCase().includes(inputValue) ||
          hit.secondaryText.toLowerCase().includes(inputValue)
      );
};

const getSuggestionValue = (suggestion: Hit) => suggestion.primaryText;

export class CommandBox extends React.Component<
  { onSelect: (value: string) => void },
  CommandBoxState
> {
  public state: CommandBoxState = { value: "", suggestions: [] };

  public onChange = (
    _event: React.SyntheticEvent,
    change: { newValue: string; method: "click" | "type" | "enter" }
  ) => {
    console.log(change.method);
    if (change.method === "click" || change.method === "enter") {
      alert(`Congratulation! You've selected '${change.newValue}'`);
      this.setState({
        value: ""
      });
      this.props.onSelect(change.newValue);
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
    if (ev.key === "enter") {
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
      autofocus: true,
      onChange: this.onChange,
      id: "CommandBoxInput",
      onkeydown: (ev: React.KeyboardEvent) => this.handleSubmit(ev)
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
