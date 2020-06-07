import { combineReducers, getInitialState } from "./utils";
import { theme } from "./theme";

export const rootReducer = combineReducers({
  theme,
});

export const initialState = getInitialState(rootReducer);
