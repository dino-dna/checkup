import { resolve } from 'path'

export const isDev = process.env.NODE_ENV === 'development'
export const devWebIndex = 'http://localhost:1234'
export const prodWebIndex = `${resolve(__dirname, '..', 'dist', 'index.html')}`
