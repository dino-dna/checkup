import { menubar } from 'menubar'
import Electron from 'electron'
import { prodWebIndex, isDev } from './env'
import { resolve, dirname } from 'path'
import { Status, AppState, IconTheme } from './interfaces'

export const getStatusIcon = (
  nativeImage: typeof Electron['nativeImage'],
  iconTheme: IconTheme = 'stencil_dark',
  status: Status
) => {
  const iconFilename = resolve(
    __dirname,
    '..',
    'assets',
    'iconTheme',
    iconTheme,
    'status',
    `${status}.png`
  )
  return nativeImage
    .createFromPath(iconFilename)
    .resize({ width: 16, height: 16 })
}

export function create ({
  appState,
  electron
}: {
  electron: typeof Electron
  appState: AppState
}) {
  const icon = getStatusIcon(electron.nativeImage, appState.iconTheme, 'ok')
  const dir = dirname(prodWebIndex)
  const mb = menubar({
    browserWindow: {
      darkTheme: true,
      frame: isDev,
      show: isDev,
      transparent: false,
      width: isDev ? 1000 : 450,
      height: isDev ? 1000 : 400,
      y: 24,
      webPreferences: {
        devTools: isDev,
        nodeIntegration: true
      }
    },
    dir,
    icon,
    preloadWindow: isDev
  })
  mb.on('ready', () => {
    isDev && (mb as any)._browserWindow.openDevTools()
  })
  return mb
}
