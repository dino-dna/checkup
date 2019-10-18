import React from 'react'
import ReactDOM from 'react-dom'
import './icons.min.css'
import './app.scss'
import { Status, TestResult } from '../interfaces'

export enum StatusIcons {
  OK = 'icono-checkCircle',
  NOT_OK = 'icono-crossCircle',
  PENDING = 'icono-sync'
}

const results: TestResult[] = [
  { name: 'thingone', status: 'ok', lastSuccessTime: new Date() },
  { name: 'two', status: 'not_ok', lastSuccessTime: new Date() },
  { name: 'threee', status: 'pending', lastSuccessTime: new Date() }
]

const toStatusIcon = (status: Status) => (
  <i
    className={`${
      status === 'ok'
        ? StatusIcons.OK
        : status === 'not_ok'
        ? StatusIcons.NOT_OK
        : StatusIcons.PENDING
    }`}
  />
)

ReactDOM.render(
  <div>
    <h1>Statuses</h1>
    <ol
      className='tests'
      children={results.map((result, i) => (
        <div key={i}>
          {toStatusIcon(result.status)}
          {result.name}
          {' | '}
          {result.lastSuccessTime.toISOString()}
        </div>
      ))}
    />
    <div className='config row'>
      <i className='icono-gear' />
      <span className='caption'>Configure</span>
    </div>
  </div>,
  document.getElementById('app')
)
