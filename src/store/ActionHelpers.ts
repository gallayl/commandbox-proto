export const createAction = <TReturns extends { type: string }, TArgs extends any[]>(
  creator: (...args: TArgs) => TReturns,
) => {
  const actionType = (creator as any)().type

  // const wrappedMethod: ((...args: TArgs) => TReturns & { type: string }) & { actionType: string } = (
  //   ...wrappedArgs: TArgs
  // ) => ({
  //   ...creator(...wrappedArgs),
  //   type: actionType,
  // })
  ;(creator as any).actionType = actionType
  return creator as typeof creator & { actionType: string }
  // return wrappedMethod
}

export const isFromAction = <TAction extends ((...args: any[]) => any) & { actionType: string }>(
  action: { type: string },
  expectedAction: TAction,
): action is ReturnType<TAction> => action.type === expectedAction.actionType
