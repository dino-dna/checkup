import { resolve } from 'path'
import electronIsDev from 'electron-is-dev'

export const isDev = electronIsDev
export const prodWebIndex = `${resolve(
  __dirname,
  '..',
  'dist_web',
  'index.html'
)}`
