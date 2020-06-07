export type Action<T extends string = any, P extends any = any> = {
  meta?: any;
  payload: P;
  type: T;
};

export type Reducer<S, A extends Action> = (
  state: S | undefined,
  action: A
) => S;

export type ReducersMapObject<S, A extends Action> = {
  [K in keyof S]: Reducer<S[K], A>;
};

type ValueOf<T> = T[keyof T];

export type ActionFromReducersMapObject<
  M extends ReducersMapObject<any, any>
> = ValueOf<{ [K in keyof M]: M[K] extends Reducer<any, infer A> ? A : never }>;

export type StateFromReducer<R> = R extends Reducer<infer S, any> ? S : never;

export type StateFromReducersMapObject<
  M extends ReducersMapObject<any, any>
> = { [K in keyof M]: M[K] extends Reducer<infer S, any> ? S : never };

const INIT_ACTION: Action<"__INIT__"> = {
  payload: null,
  type: "__INIT__",
};

export const combineReducers = <M extends ReducersMapObject<any, any>>(
  reducers: M
): Reducer<StateFromReducersMapObject<M>, ActionFromReducersMapObject<M>> => {
  const reducerNames: Array<keyof M> = Object.keys(reducers);

  return (state, action) =>
    reducerNames.reduce(
      (nextState, name) => ({
        ...nextState,
        [name]: reducers[name](state ? state[name] : undefined, action),
      }),
      {} as StateFromReducersMapObject<M>
    );
};

export const getInitialState = <R extends Reducer<any, any>>(
  rootReducer: R
): StateFromReducer<R> => rootReducer(undefined, INIT_ACTION);
