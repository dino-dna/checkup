import React from 'react'
import { Status, TestResult, StatusIcons } from '../interfaces'
import './Statuses.scss'

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

export const Statuses = ({ results }: { results: TestResult[] }) => {
  return !results.length ? (
    <span className='tests' children='Click "Configure" and setup a check' />
  ) : (
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
  )
}
