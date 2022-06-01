import { ipcRenderer } from "electron/renderer";
import { Action, Reducer } from "./utils";

export enum Themes {
  Dark = "dark",
  Light = "light",
}

// Fetch from main process
// TODO: Refactor to pass with initial `appState`?
// https://github.com/nathanbuchar/electron-settings/wiki/FAQs#can-i-use-electron-settings-in-both-the-main-and-renderer-processes
export const getInitialTheme = () => {
  return Themes.Light;
};

export const toggle = (theme: Themes) =>
  theme === Themes.Dark ? Themes.Light : Themes.Dark;

export interface ThemeState {
  value: Themes;
}

export type ThemeAction = Action<"TOGGLE_THEME">;

export const theme: Reducer<ThemeState, ThemeAction> = (
  state = {
    value: getInitialTheme(),
  },
  action
) => {
  if (action.type === "TOGGLE_THEME") {
    return {
      value: toggle(state.value),
    };
  }

  return state;
};
