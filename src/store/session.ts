import { User } from "@sensenet/default-content-types"
import { LoginState, ConstantContent } from "@sensenet/client-core"
import { Reducer, AnyAction } from "redux";

export const createAction = <TReturns, TArgs extends any[]>(creator: (...args: TArgs) => TReturns) => {
    const symbol = Symbol(creator.name);
    const wrappedMethod: ((...args: TArgs) => TReturns & {symbol: Symbol}) & {symbol: Symbol} = (...wrappedArgs: TArgs) => ({
            ...creator(...wrappedArgs),
            type: creator.name,
            symbol
    });
    wrappedMethod.symbol = symbol
    
    return wrappedMethod
}

export const isFromAction = <TAction extends ((...args: any[]) => any) & {symbol: Symbol}>(action: {symbol: Symbol}, expectedAction: TAction) : action is ReturnType<TAction> => action.symbol === expectedAction.symbol;

export interface SessionReducerType {
    loginState: LoginState
    currentUser: User
}

export const setCurrentUser = createAction((user: User) => ({
    user,
}))

setCurrentUser.symbol
setCurrentUser({} as User)

export const session: Reducer<SessionReducerType, AnyAction & {symbol: Symbol} > = (state={loginState: LoginState.Unknown, currentUser: ConstantContent.VISITOR_USER}, action) => {
    if (isFromAction(action, setCurrentUser)){
        action.user
    }


    return state;
}