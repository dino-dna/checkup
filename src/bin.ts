import { app } from 'electron'
import { create as createMenubar } from './menubar'
import {
  upsertConfigDir,
  debouncedReload,
  getConfigFilename,
  reload
} from './configure'
import { AppState } from './interfaces'
import { create } from './app.actions'

app.on('ready', async () => {
  await upsertConfigDir()
  const mb = createMenubar()
  const appState: AppState = {
    actions: {} as any, // hacks
    state: 'OK',
    jobs: {}
  }
  appState.actions = create({
    menubar: mb,
    appState
  })
  ;['after-hide', 'after-show'].map(eventName => {
    mb.on(eventName, () => reloadConfig(appState))
  })
  reloadConfig(appState)
})

const reloadConfig = (appState: AppState) =>
  debouncedReload({ appState, configFilename: getConfigFilename() })
    .then(() => (appState.errorMessage = ''))
    .catch((err: Error) => {
      console.log(err)
      appState.state = 'BAD_CONFIG_FILE'
      appState.errorMessage = err.message
    })
    .then(() => appState.actions.onStateUpdated())
