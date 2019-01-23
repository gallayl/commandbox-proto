import { combineReducers, createStore, applyMiddleware } from "redux";
import { ReduxDiMiddleware } from "redux-di-middleware";
import { session } from "./session";
import { Injector } from "@furystack/inject";

export const rootReducer = combineReducers({
    session,
})
export type rootStateType = ReturnType<typeof rootReducer>
export const diMiddleware = new ReduxDiMiddleware(Injector.Default);
export const store = createStore(rootReducer, {}, applyMiddleware(diMiddleware.getMiddleware()))