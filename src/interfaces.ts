export type Status = 'ok' | 'pending' | 'not_ok'

export type TestResult = {
  name: string
  status: Status
  lastSuccessTime: Date
}
