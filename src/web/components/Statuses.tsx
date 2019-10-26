import React from 'react'
import { Job as JobInterface } from '../../interfaces'
import { Body } from './Text'
import { Job } from './Job'
import './Statuses.scss'

/*
const getNextRunEstimate = (job: Job) => {
  if (!job.state.nextRunDate) return '?'
  const now = new Date().getTime()
  const duration = moment.duration(job.state.nextRunDate.getTime() - now, 'ms')
  return `next in: ${duration.humanize()}`
}
*/

export const Statuses = ({ jobs }: { jobs: JobInterface[] }) => {
  return !jobs.length ? (
    <div className='Statuses'>
      <Body
        center
        children='Click "Configure" and setup a job'
        className='Statuses-empty'
      />
    </div>
  ) : (
    <ol className='Statuses'>
      {jobs.map(job => (
        <li key={job.name}>
          <Job job={job} />
        </li>
      ))}
    </ol>
  )
}
