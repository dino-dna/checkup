import { copyFile, mkdirp, lstat } from 'fs-extra'
import { resolve } from 'path'
import { shell } from 'electron'

const applicationConfigPath = require('application-config-path')

export const getConfigDir = () => applicationConfigPath('checkup') as string
export const getConfigTempleateFilename = () =>
  resolve(__dirname, 'configure.template.ts')
export const getConfigFilename = () => resolve(getConfigDir(), 'config.ts')
export const upsertConfigDir = async () => {
  const configDirname = getConfigDir()
  await mkdirp(configDirname)
  const templateFilename = resolve(__dirname, 'configure.template.ts')
  await lstat(getConfigFilename()).catch(async err => {
    if (err.code === 'ENOENT') { await copyFile(templateFilename, getConfigFilename()) }
  })
}

export const edit = async () => {
  shell.showItemInFolder(getConfigFilename())
}
// openEditor([
//   {
//     file,
//     line: 1,
//     column: 1
//   }
// ]);
// const editor = process.env.EDITOR! || 'vim'
// const args: string[] = []
// if (editor.match(/vscode/)) args.push('--wait')
// await execa(editor, args).catch(() => null)
