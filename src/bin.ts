import { app, ipcMain } from 'electron'
import { create as createMenubar } from './menubar'
import {
  upsertConfigDir,
  debouncedReload,
  getConfigFilename,
  edit
} from './configure'
import { AppState } from './interfaces'
import { create } from './app.actions'
import { FromUi } from './messages'

app.on('ready', async () => {
  // @warn `import electron ...` init's some powerModule
  // which crashes if done before `'ready'`
  const electron = require('electron')
  await upsertConfigDir()
  const mb = createMenubar(electron)
  const appState: AppState = {
    actions: {} as any, // hacks
    state: 'OK',
    jobs: {}
  }
  appState.actions = create({
    appState,
    electron,
    menubar: mb
  })
  ;['after-hide', 'after-show'].map(eventName => {
    mb.on(eventName, () => reloadConfig(appState))
  })
  reloadConfig(appState)
  ipcMain.on('bus', (_, msg: FromUi) => {
    switch (msg) {
      case FromUi.REQUEST_OPEN_CONFIG_FOLDER:
        return edit(electron)
      default:
        throw new Error(`unsupported message from ui: ${msg}`)
    }
  })
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
