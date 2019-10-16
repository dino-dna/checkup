import { menubar } from 'menubar'
import { app, nativeImage } from 'electron'
import { resolve } from 'path'
import { devWebIndex, prodWebIndex, isDev } from './env'

export type Status = 'ok' | 'pending' | 'not_ok'
const getStatusIcon = (status: Status) =>
  nativeImage
    .createFromPath(resolve(__dirname, '..', 'assets', `status_${status}.png`))
    .resize({ width: 16, height: 16 })

app.on('ready', () => {
  const icon = getStatusIcon('ok')
  const mb = menubar({
    icon,
    index: isDev ? devWebIndex : prodWebIndex,
    browserWindow: { y: 24, transparent: false }
  })

  mb.on('ready', () => {
    // your app code here
  })
})
