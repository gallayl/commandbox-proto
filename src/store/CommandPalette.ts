import { Reducer } from "redux";
import { createAction, isFromAction } from "./ActionHelpers";
import { rootStateType } from ".";
import { IInjectableActionCallbackParams } from "redux-di-middleware";
import { CommandProviderManager } from "../services/CommandProviderManager";

export interface CommandPaletteItem {
    primaryText: string
    secondaryText: string
    icon?: string
    avatar?: {
        abbrev: string
        url?: string
    }
}

export interface CommandPaletteState {
    isOpened: boolean;
    inputValue: string;
    items: CommandPaletteItem[]
}

export const defaultCommandPaletteState: CommandPaletteState = {
    isOpened: false,
    inputValue: "",
    items: []
}

export const open = createAction(()=>({type: "OPEN_COMMAND_PALETTE"}));
export const close = createAction(()=>({type: "CLOSE_COMMAND_PALETTE"}));
export const clearItems = createAction(()=>({type: "CLEAR_COMMAND_PALETTE_ITEMS"}));
export const setItems = createAction((items: CommandPaletteItem[])=>({type: "SET_COMMAND_PALETTE_ITEMS", items}));
export const setInputValue = createAction((value: string) => ({type: "SET_COMMAND_PALETTE_INPUT_VALUE", value}))

export const updateItemsFromTerm = createAction((value: string) => ({
    type: "UPDATE_ITEMS_FROM_TERM",
    inject: async (options: IInjectableActionCallbackParams<rootStateType>) => {
        const commandProviderManager = options.getInjectable(CommandProviderManager)
        const items = await commandProviderManager.getItems(value)
        options.dispatch(setItems(items))
    }
}))

export const commandPalette: Reducer<CommandPaletteState> = (state = defaultCommandPaletteState, action) => {
    if (isFromAction(action, open)){
        return {
            ...state,
            isOpened: true
        }
    } else if (isFromAction(action, close)){
        return {
            ...state,
            isOpened: false
        }
    } else if (isFromAction(action, setInputValue)){
        return {
            ...state,
            inputValue: action.value
        }
    } else if (isFromAction(action, clearItems)){
        return {
            ...state,
            items: []
        }
    } else if (isFromAction(action, setItems)){
        return {
            ...state,
            items: [...action.items]
        }
    }




    return state
}