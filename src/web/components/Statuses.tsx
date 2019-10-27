import { Fragment, h } from 'preact'
import clsx from 'clsx'
import { Job as JobInterface } from '../../interfaces'
import { Body } from './Text'
import { Job } from './Job'
import './Statuses.scss'

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
