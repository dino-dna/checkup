import { menubar } from 'menubar'
import { nativeImage } from 'electron'
import { prodWebIndex, isDev } from './env'
import { resolve, dirname } from 'path'
import { Status } from './interfaces'

export const getStatusIcon = (status: Status) =>
  nativeImage
    .createFromPath(resolve(__dirname, '..', 'assets', `status_${status}.png`))
    .resize({ width: 16, height: 16 })

export function create () {
  const icon = getStatusIcon('ok')
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
