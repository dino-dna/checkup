import { Action, Reducer } from './utils'

export enum Themes {
  Dark = 'dark',
  Light = 'light'
}

export interface ThemeState {
  value: Themes
}

export type ThemeAction = Action<'TOGGLE_THEME'>

export const theme: Reducer<ThemeState, ThemeAction> = (
  state = {
    value: Themes.Light
  },
  action
) => {
  if (action.type === 'TOGGLE_THEME') {
    return {
      value: state.value === Themes.Light ? Themes.Dark : Themes.Light
    }
  }

  return state
}
