import React from 'react'
import { StatusIcons, Job } from '../../interfaces'
import './Statuses.scss'
import moment from 'moment'

const toMessageDom = (msg: string) => (
  <>
    <br />
    <span className='job-error-msg' children={`Error: ${msg}`} />
  </>
)

const toStatusIcon = (job: Job) => {
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
    <span className='jobs' children='Click "Configure" and setup a job' />
  ) : (
    <ol
      className='jobs'
      children={jobs.map((job, i) => (
        <div className='job' style={{ clear: 'both' }} key={i}>
          <span children={toStatusIcon(job)} />
          <span className='job-name' children={job.name} />
          <span children={!!job.state.lastSuccess && job.state.lastSuccess} />
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
          {!!job.state.message && toMessageDom(job.state.message)}
        </div>
      ))}
    />
  )
}
