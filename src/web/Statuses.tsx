import React from 'react'
import { StatusIcons, Job } from '../interfaces'
import './Statuses.scss'
import moment from 'moment'

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

const getNextRunEstimate = (job: Job) => {
  if (!job.state.nextRunDate) return '?'
  const now = new Date().getTime()
  const duration = moment.duration(job.state.nextRunDate.getTime() - now, 'ms')
  return <span children={`next in: ${duration.humanize()}`} />
}

export const Statuses = ({ jobs }: { jobs: Job[] }) => {
  return !jobs.length ? (
    <span className='tests' children='Click "Configure" and setup a job' />
  ) : (
    <ol
      className='tests'
      children={jobs.map((job, i) => (
        <div style={{ clear: 'both' }} key={i}>
          <span children={toStatusIcon(job)} />
          <span children={job.name} />
          <span
            children={job.state.lastSuccess ? job.state.lastSuccess : '-'}
          />
          {/* <br /> */}
          <span
            style={{
              float: 'right',
              fontSize: 'small',
              display: 'block',
              color: 'gray',
              fontStyle: 'italic'
            }}
            children={getNextRunEstimate(job)}
          />
        </div>
      ))}
    />
  )
}
