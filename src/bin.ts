import { menubar } from 'menubar'
import { app, Menu, Tray } from 'electron'
import { resolve } from 'path'

app.on('ready', () => {
  const tray = new Tray(resolve(__dirname, '..', 'assets', 'kitty.png'))
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ])
  tray.setContextMenu(contextMenu)

  const mb = menubar({
    tray
  })

  mb.on('ready', () => {
    console.log('Menubar app is ready.')
    // your app code here
  })
})
