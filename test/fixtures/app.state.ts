import { AppState } from '../../src/interfaces'
import { create } from '../../src/app.actions'

export const createAppState: () => AppState = () => {
  const appState: AppState = {
    actions: {} as any,
    jobs: {},
    state: 'OK'
  }
  appState.actions = create({
    menubar: {} as any,
    appState
  })
  return appState
}