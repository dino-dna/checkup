import React from 'react'
import { StatusIcons, Job } from '../interfaces'
import './Statuses.scss'

const toStatusIcon = (job: Job) => {
  // if (!job || !job.state) {
  // debugger
  // }
  const {
    state: { status }
  } = job
  return (
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
}

export const Statuses = ({ jobs }: { jobs: Job[] }) => {
  return !jobs.length ? (
    <span className='tests' children='Click "Configure" and setup a job' />
  ) : (
    <ol
      className='tests'
      children={jobs.map((job, i) => (
        <div key={i}>
          {toStatusIcon(job)}
          {job.name}
          {' | '}
          {job.state.lastSuccess ? job.state.lastSuccess : '-'}
        </div>
      ))}
    />
  )
}
