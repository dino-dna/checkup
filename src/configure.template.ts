import { Toolkit, CheckupConfig } from './interfaces'

export const configure: (toolkit: Toolkit) => CheckupConfig = ({
  fs,
  fetch
}) => {
  return {
    checks: [
      {
        name: 'my-api-status',
        fn: () => fetch('www.google.com').then(res => res.ok)
      },
      {
        name: 'failure-with-message-example',
        fn: async () => {
          try {
            throw new Error('suppose something went wrong')
          } catch {
            return { errorMessage: 'uh oh - human friendly msg' }
          }
        }
      }
    ]
  }
}
