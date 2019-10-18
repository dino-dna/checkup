import { menubar } from 'menubar'
import { app, nativeImage } from 'electron'
import { resolve, dirname } from 'path'
import { devWebIndex, prodWebIndex, isDev } from './env'
import { Status } from './interfaces'
import { upsertConfigDir } from './configure'

const getStatusIcon = (status: Status) =>
  nativeImage
    .createFromPath(resolve(__dirname, '..', 'assets', `status_${status}.png`))
    .resize({ width: 16, height: 16 })

app.on('ready', async () => {
  await upsertConfigDir()
  const icon = getStatusIcon('ok')
  const dir = dirname(prodWebIndex)
  const mb = menubar({
    icon,
    dir,
    // index: prodWebIndex, // isDev ? devWebIndex : prodWebIndex,
    preloadWindow: isDev,
    browserWindow: {
      darkTheme: true,
      titleBarStyle: isDev ? 'default' : 'hidden',
      y: 24,
      transparent: false,
      width: 300,
      frame: isDev,
      show: isDev,
      webPreferences: {
        devTools: isDev,
        nodeIntegration: true // isDev
      }
    }
  })

  mb.on('ready', () => {
    // your app code here
    ;(mb as any)._browserWindow.openDevTools()
  })
})
