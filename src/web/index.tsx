import React from 'react'
import ReactDOM from 'react-dom'
import './icons.min.css'
import './global.scss'
import * as configure from '../configure'
import { FromServer, FromUi } from '../messages'
import { delay } from 'bluebird'
import { Checkup, CheckupProps } from './components/Checkup'

const onConfigure = () => {
  window
    .require('electron')
    .ipcRenderer.send('bus', FromUi.REQUEST_OPEN_CONFIG_FOLDER)
}

const refreshMainState: () => any = () => {
  const conf: typeof configure = window
    .require('electron')
    .remote.require('./configure')
  const nextState = conf.getState()
  if (!nextState) {
    return delay(100).then(refreshMainState)
  }
  state.main = nextState
  render()
}

window.require('electron').ipcRenderer.on('bus', (evt, msg) => {
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
    <Checkup onConfigure={onConfigure} state={state} />,
    document.getElementById('app')
  )

refreshMainState()
