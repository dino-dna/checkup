import React from 'react'
import ReactDOM from 'react-dom'
import './icons.min.css'
import './global.scss'
import * as configure from '../configure'
import { FromServer, FromUi } from '../messages'
import { delay } from 'bluebird'
import { Checkup, CheckupProps } from './components/Checkup'
import { LogMsg, Logger } from '../interfaces'

const { ipcRenderer, remote } = window.require('electron')

const log: Logger = log =>
  ipcRenderer.send('bus', FromUi.LOG, {
    processName: 'renderer',
    ...log
  } as LogMsg)

const onConfigure = () =>
  ipcRenderer.send('bus', FromUi.REQUEST_OPEN_CONFIG_FOLDER)

const onIssue = () => {
  window
    .require('electron')
    .ipcRenderer.send('bus', FromUi.REQUEST_OPEN_ISSUE_URL)
}

const refreshMainState: () => any = () => {
  const conf: typeof configure = remote.require('./configure')
  const nextState = conf.getState()
  if (!nextState) {
    return delay(100).then(refreshMainState)
  }
  state.main = nextState
  render()
}

ipcRenderer.on('bus', (_, msg) => {
  log({ level: 'verbose', message: `received ${msg}` })
  switch (msg) {
    case FromServer.STATE_UPDATED:
      return refreshMainState()
    default:
      throw new Error(`unsupported msg: ${msg}`)
  }
})

const state: CheckupProps['state'] = {
  main: null
}

const render = () =>
  ReactDOM.render(
    <Checkup onConfigure={onConfigure} onIssue={onIssue} state={state} />,
    document.getElementById('app')
  )

refreshMainState()
