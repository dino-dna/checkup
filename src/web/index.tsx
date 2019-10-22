import React from 'react'
import ReactDOM from 'react-dom'
import { Statuses } from './Statuses'
import './icons.min.css'
import './app.scss'
import * as configure from '../configure'
import { FromServer } from '../messages'
import { AppState } from '../interfaces'
import { delay } from 'bluebird'

const onConfigure = () => {
  const conf: typeof configure = window
    .require('electron')
    .remote.require('./configure')
  conf.edit()
}

const refreshMainState: () => any = () => {
  const conf: typeof configure = window
    .require('electron')
    .remote.require('./configure')
  const nextState = conf.getState()
  if (!nextState) {
    console.log('refreshMainState: polling')
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

const state: {
  main: AppState | null
} = {
  main: null
}

const render = () =>
  ReactDOM.render(
    <div id='checkup'>
      <h4 style={{ borderTop: 'none' }}>Statuses</h4>
      {state.main && state.main.state === 'OK' ? (
        <Statuses jobs={state.main ? Object.values(state.main.jobs) : []} />
      ) : (
        <>
          <h2>Bad config</h2>
          <p>
            Bad configuration file detected{' '}
            {state.main!.errorMessage || 'unknown error'}
          </p>
        </>
      )}
      <div style={{ flexGrow: 1 }} />
      <div className='config row' onClick={onConfigure}>
        <i className='icono-gear' />
        <span className='caption'>Configure</span>
      </div>
    </div>,
    document.getElementById('app')
  )

refreshMainState() // render is a side-effect
