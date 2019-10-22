import { ConfigureFn, AppState, Job, JobsByName } from './interfaces'
import { getFirstExistingFilename } from './files'
import * as fs from 'fs-extra'
import fetch from 'node-fetch'
import { isDev } from './env'
const nodeEval = require('node-eval')

const onStartPoll: (opts: {
  jobs: JobsByName
  name: string
  actions: AppState['actions']
}) => Promise<void> = async ({ actions, jobs, name }) => {
  const now = new Date()
  const job = jobs[name]
  const nextPoll = job.pollDurationMs || (isDev ? 10000 : 60000 * 10)
  job.state.status = 'pending'
  Promise.resolve(job.fn())
    .then(res => {
      if (typeof res === 'string') job.state!.message = res
      job.state.lastRunDate = now
      job.state.lastSuccess = now
      job.state.message = ''
      job.state.status = 'ok'
    })
    .catch(err => {
      job.state.lastFailure = now
      job.state.message = err && err.message ? err.message : ''
      job.state.status = 'not_ok'
    })
    .then(() => {
      job.state!.lastRunDate = now
      job.state.nextRunDate = new Date(now.getTime() + nextPoll)
      actions.onStateUpdated()
      return setTimeout(() => onStartPoll({ actions, jobs, name }), nextPoll)
    })
}
export async function rectify ({
  actions,
  configFilename,
  jobs
}: AppState & { configFilename: string }) {
  const jsConfigTemplateFilename = configFilename.replace(/\.ts$/, '.js')
  const jsConfigFilename = configFilename.replace('.template.js', '.js')
  const finalJsConfigFilename = await getFirstExistingFilename(
    jsConfigFilename,
    jsConfigTemplateFilename
  )
  const createNextJobs = await fs
    .readFile(finalJsConfigFilename)
    .then(buf => Promise.resolve(nodeEval(buf.toString())))
  if (!createNextJobs && !createNextJobs.configure) {
    throw new Error('config file must export function named configure')
  }
  const configure: ConfigureFn = createNextJobs.configure
  const getJobsRes = configure({ fetch, fs })
  const nextJobs = (await Promise.resolve(getJobsRes)) as Job[]
  const nextJobNames = new Set(nextJobs.map(job => job.name))
  const currJobNames = new Set(Object.values(jobs).map(job => job.name))
  for (const job of Object.values(nextJobs)) {
    const oldJob = jobs[job.name]
    jobs[job.name] = job
    if (!oldJob) {
      // init new state
      job.state = { status: 'pending' }
      await onStartPoll({
        name: job.name,
        jobs,
        actions
      })
    } else {
      // recycle old state
      jobs[job.name] = job
      job.state = oldJob.state
    }
  }
  // purge removed jobs
  const toRemoveJobNames = new Set(currJobNames)
  nextJobNames.forEach(name => toRemoveJobNames.delete(name))
  toRemoveJobNames.forEach(jobName => {
    const job = jobs[jobName]
    clearTimeout(job.state.nextRunTimer!)
    delete jobs[jobName]
  })
}
