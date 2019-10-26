import { AppActions } from './app.actions'
import execa from 'execa'
import Fetch from 'node-fetch'
import fs from 'fs-extra'

export type Status = 'ok' | 'pending' | 'not_ok'

export type ProcessName = 'main' | 'renderer'
export type Level = 'info' | 'warn' | 'error' | 'verbose'
export type LogMsg = {
  level: Level
  tags?: string[]
  message: string
}
export type ProcessLogger = (log: LogMsg & { processName: ProcessName }) => void
export type Logger = (log: LogMsg) => void
export type TestResult = {
  name: string
  status: Status
  lastSuccessTime: Date
}

export type Toolkit = {
  execa: typeof execa
  fetch: typeof Fetch
  fs: typeof fs
  log: Logger
}
export type JobResponsePrimative = boolean | string
export type Job = {
  fn: ({
    log
  }: {
    log: Logger
  }) => JobResponsePrimative | Promise<JobResponsePrimative>
  pollDurationMs?: number
  name: string
  state: {
    status: Status
    nextRunDate?: Date
    message?: string
    lastRunDate?: Date
    lastSuccess?: Date
    lastFailure?: Date
    nextRunTimer?: NodeJS.Timeout
  }
}
export type ConfigureFn = (toolkit: Toolkit) => Omit<Job, 'state'>[]
export type JobsByName = {
  [jobName: string]: Job
}

export interface WithJobs {
  jobs: JobsByName
}

export type AppStates = 'BAD_CONFIG_FILE' | 'OK'

export type AppState = {
  actions: AppActions
  state: AppStates
  jobs: JobsByName
  errorMessage?: string
}
