import Fetch from 'node-fetch'
import fs from 'fs-extra'

export type Status = 'ok' | 'pending' | 'not_ok'

export type TestResult = {
  name: string
  status: Status
  lastSuccessTime: Date
}

export enum StatusIcons {
  OK = 'icono-checkCircle',
  NOT_OK = 'icono-crossCircle',
  PENDING = 'icono-sync'
}

export type Toolkit = {
  fetch: typeof Fetch
  fs: typeof fs
}

export type CheckResult =
  | boolean
  | {
      errorMessage: string
    }
  | {
      successMessage: string
    }
export type Check = {
  name: string
  fn: () => CheckResult | Promise<CheckResult>
}

export type CheckupConfig = {
  checks: Check[]
}
