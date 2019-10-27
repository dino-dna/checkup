import { Action, Reducer } from './utils'

export enum Themes {
  Dark = 'dark',
  Light = 'light'
}

export const getInitialTheme = () => Themes.Light

export const toggle = (theme: Themes) =>
  theme === Themes.Dark ? Themes.Light : Themes.Dark

export interface ThemeState {
  value: Themes
}

export type ThemeAction = Action<'TOGGLE_THEME'>

export const theme: Reducer<ThemeState, ThemeAction> = (
  state = {
    value: getInitialTheme()
  },
  action
) => {
  if (action.type === 'TOGGLE_THEME') {
    return {
      value: toggle(state.value)
    }
  }

  return state
}
