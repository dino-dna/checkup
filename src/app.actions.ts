import { AppState, Status } from './interfaces'
import { FromServer } from './messages'
import { getStatusIcon } from './menubar'
import { Menubar } from 'menubar'
import Electron from 'electron'

export const create = ({
  electron,
  menubar: mb,
  appState
}: {
  electron: typeof Electron
  menubar: Menubar
  appState: AppState
}) => {
  const getWindow = () => (mb as any)._browserWindow
  return {
    onStateUpdated: () => {
      // @warn - skip in tests. electron things are missing
      if (process.env.NODE_ENV === 'test') return
      const jobStatuses = Object.values(appState.jobs).map(
        job => job.state.status
      )
      const trayStatus: Status =
        appState.state === 'BAD_CONFIG_FILE'
          ? 'not_ok'
          : !jobStatuses.length
            ? 'pending'
            : jobStatuses.some(status => status === 'not_ok')
              ? 'not_ok'
              : jobStatuses.some(status => status === 'pending')
                ? 'pending'
                : 'ok'
      mb.tray.setImage(getStatusIcon(electron.nativeImage, trayStatus))
      const window = getWindow()
      if (!window) {
        console.warn('[no window found]')
        return
      }
      return window.webContents.send('bus', FromServer.STATE_UPDATED)
    }
  }
}

export type AppActions = ReturnType<typeof create>
