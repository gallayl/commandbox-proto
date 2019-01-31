import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowRightTwoTone from "@material-ui/icons/KeyboardArrowRightTwoTone";
import { rootStateType } from "../../store";
import { open, close, setInputValue, updateItemsFromTerm, clearItems, CommandPaletteItem } from "../../store/CommandPalette";
import { connect } from "react-redux";
import { ClickAwayListener } from "@material-ui/core";
import Autosuggest, { InputProps, SuggestionsFetchRequestedParams } from "react-autosuggest"
import { CommandPaletteSuggestion } from "./CommandPaletteSuggestion";
import { CommandPaletteHitsContainer } from "./CommandPaletteHitsContainer";
import { debounce } from "@sensenet/client-utils";

const mapStateToProps = (state: rootStateType) => ({
    isOpened: state.commandPalette.isOpened,
    items: state.commandPalette.items,
    inputValue: state.commandPalette.inputValue
})

const mapDispatchToProps = {
    open,
    close,
    setInputValue,
    updateItemsFromTerm,
    clearItems
}


export class CommandPaletteComponent extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps>{
  private containerRef?: HTMLDivElement;
    
    private handleKeyUp(ev: KeyboardEvent) {
        if (ev.key.toLowerCase() === "p" && ev.ctrlKey) {
          ev.stopImmediatePropagation();
          ev.preventDefault();
          if (ev.shiftKey) {
            this.props.setInputValue(">")
            this.props.open()
          } else {
            this.props.setInputValue("")
            this.props.open()
          }
        } else {
          if (ev.key === "Escape") {
            this.props.close()
          }
        }
      }

    constructor(props: CommandPaletteComponent["props"]) {
        super(props);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleSuggestionsFetchRequested = this.handleSuggestionsFetchRequested.bind(this)
        this.handleSetInputValue = this.handleSetInputValue.bind(this)
      }

    private handleSuggestionsFetchRequested = debounce((options: SuggestionsFetchRequestedParams) =>{
        this.props.updateItemsFromTerm(options.value);
    }, 500)

    public componentDidMount() {
        document.addEventListener("keyup", this.handleKeyUp);
        document.addEventListener("keydown", this.handleKeyUp);
      }
    
      public componentWillUnmount() {
        document.removeEventListener("keyup", this.handleKeyUp);
        document.removeEventListener("keydown", this.handleKeyUp);
      }

      private handleSetInputValue(ev: React.ChangeEvent<HTMLInputElement>){
        this.props.setInputValue(ev.target.value);
      }

    public render(){
      const inputProps: InputProps<CommandPaletteItem> = {
        value: this.props.inputValue,
        onChange: this.handleSetInputValue,
        id: 'CommandBoxInput',
        autoFocus: true,
        onBlur: this.props.close,
      }

      if (!this.props.isOpened) {
        return  <Tooltip style={{flex: 1, justifyContent: 'start'}} placeholder="bottom" title="Show Command Palette">
        <div><IconButton onClick={this.props.open}>
            <KeyboardArrowRightTwoTone />
        </IconButton>
        </div>
        </Tooltip>
      }

        return (<div style={{flex: 1, padding: "0 2em"}}>
        <ClickAwayListener onClickAway={this.props.close}>
            <div  ref={r=>r ? this.containerRef = r : null}>
            <Autosuggest<CommandPaletteItem>
              theme={{
                suggestionsList: {
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                },
                input: {
                  width: '100%',
                  padding: '5px',
                  fontFamily: 'monospace',
                  color: 'white',
                  border: '1px solid #333',
                  backgroundColor: 'rgba(255,255,255,.10)'
                },
                inputFocused: {
                  border: '1px solid #13a5ad'
                }
              }}
              alwaysRenderSuggestions
              suggestions={this.props.items}
              highlightFirstSuggestion
              onSuggestionSelected={this.props.close}
              onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.props.clearItems}
              getSuggestionValue={(s)=>s.primaryText}
              renderSuggestion={(s, params)=><CommandPaletteSuggestion suggestion={s} params={params} />}
              renderSuggestionsContainer={s => <CommandPaletteHitsContainer {...s} width={this.containerRef && this.containerRef.scrollWidth || 100} />}
              inputProps={inputProps}
            />
            </div>
        </ClickAwayListener>
      </div>)
    }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(CommandPaletteComponent);
export {connectedComponent as CommandPalette}