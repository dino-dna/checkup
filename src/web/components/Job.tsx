import { FunctionComponent, JSX, h } from 'preact'
import moment from 'moment'
import clsx from 'clsx'
import { Body, Caption, Code } from './Text'
import { Job as JobInterface } from '../../interfaces'
import './Job.scss'

export interface JobProps extends JSX.HTMLAttributes {
  job: JobInterface
}

const getNextRunEstimate = (nextRunDate?: string) => {
  if (!nextRunDate) return '?'
  const now = new Date().getTime()
  const duration = moment.duration(
    moment(nextRunDate)
      .toDate()
      .getTime() - now,
    'ms'
  )
  return `next in: ${duration.humanize()}`
}

export const Job: FunctionComponent<JobProps> = ({
  className,
  job: {
    name,
    state: { message, nextRunDate, status }
  },
  ...rest
}) => (
  <div className={clsx('Job', className)} {...rest}>
    <div
      className={clsx('Job-icon', {
        'Job-icon-ok': status === 'ok',
        'Job-icon-error': status === 'not_ok',
        'Job-icon-progress': status !== 'ok' && status !== 'not_ok'
      })}
    >
      <i
        className={clsx({
          'icono-checkCircle': status === 'ok',
          'icono-crossCircle': status === 'not_ok',
          'icono-sync': status !== 'ok' && status !== 'not_ok'
        })}
      />
    </div>
    <div className='Job-content'>
      <div className='Job-content-top'>
        <Body className='Job-name'>{name}</Body>
        <Caption className='Job-next-run'>
          {getNextRunEstimate(nextRunDate as any)}
        </Caption>
      </div>
      {!!message && (
        <Code block className='Job-message'>
          {message}
        </Code>
      )}
    </div>
  </div>
)
