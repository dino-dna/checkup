import { h, render as renderToDOM } from 'preact'
import './icons.min.css'
import './global.scss'
import { Checkup, CheckupProps } from './components/Checkup'
import { delay } from 'bluebird'
import { FromServer, FromUi } from '../messages'
import { LogMsg, Logger, AppState } from '../interfaces'
import * as configure from '../configure'
import React from 'react'
import ReactDOM from 'react-dom'

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

const onOpenLog = () => {
  window
    .require('electron')
    .ipcRenderer.send('bus', FromUi.REQUEST_OPEN_LOG_FILE)
}

const refreshMainState: () => any = () => {
  const conf: typeof configure = remote.require('./configure')
  const nextState: AppState | null = JSON.parse(conf.getJsonState())
  if (!nextState) {
    return delay(100).then(refreshMainState)
  }
  state.main = nextState
  if (state.main) {
    for (const job of Object.values(state.main.jobs)) {
      if (!job || !job.name) {
        return log({ level: 'error', message: 'unable to extract job' })
      }
    }
  }
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

const render = () => {
  const el = document.getElementById('app')

  if (el) {
    renderToDOM(
      <Checkup
        onConfigure={onConfigure}
        onIssue={onIssue}
        onOpenLog={onOpenLog}
        state={state}
      />,
      el
    )
  }
}

refreshMainState()
