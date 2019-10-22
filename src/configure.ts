import { copyFile, mkdirp, lstat } from 'fs-extra'
import { resolve } from 'path'
import Electron from 'electron'
import { debounce } from 'lodash'
import { rectify } from './jobs'
import { AppState } from './interfaces'

const applicationConfigPath = require('application-config-path')

export const getConfigDir = () => applicationConfigPath('checkup') as string
export const getConfigTempleateFilename = () =>
  resolve(__dirname, 'configure.template.js')
export const getConfigFilename = () => resolve(getConfigDir(), 'config.js')
export const upsertConfigDir = async () => {
  const configDirname = getConfigDir()
  await mkdirp(configDirname)
  const templateFilename = resolve(__dirname, 'configure.template.js')
  await lstat(getConfigFilename()).catch(async err => {
    if (err.code === 'ENOENT') {
      await copyFile(templateFilename, getConfigFilename())
    }
  })
}

export const edit = (electron: typeof Electron) =>
  electron.shell.showItemInFolder(getConfigFilename())

let dangerousAppStateRef: null | AppState = null
export const getState = () => dangerousAppStateRef

export const reload = ({
  appState,
  configFilename
}: {
  appState: AppState
  configFilename: string
}) => {
  dangerousAppStateRef = appState // look away. this is for easy/hacky renderer/main io
  // const res = compile([configFilename], {
  //   noEmitOnError: true,
  //   noImplicitAny: false,
  //   sourceMap: isDev,
  //   esModuleInterop: true,
  //   target: ts.ScriptTarget.ES5,
  //   module: ts.ModuleKind.CommonJS,
  // })
  // if (res.length) throw new Error(res.join('\n'))
  return rectify({ ...appState, configFilename })
}

export const debouncedReload = debounce(reload, 1000, {
  leading: true,
  maxWait: 5000
})
