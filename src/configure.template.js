module.exports.configure = ({ fs, fetch }) => {
  return [
    {
      name: 'my-api-status',
      fn: () => {
        return fetch('https://www.google.com').then(res => res.ok)
      }
    },
    {
      name: 'failure-with-message-example',
      fn: async () => {
        throw new Error('throw human friendly error messages, always!')
      }
    }
  ]
}
