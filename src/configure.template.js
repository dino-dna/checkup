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
    },
    {
      pollDurationMs: 10000,
      name: 'long-running-tasks-show-pending',
      fn: async () => {
        return new Promise(res => setTimeout(res, 5000))
      }
    },
    {
      pollDurationMs: 10000 * 60,
      name: 'current-air-quality',
      fn: async ({ log }) => {
        const zip = await execa('curl', ['http://ip-api.com/json']).then(res =>
          parseInt(JSON.parse(res.stdout).zip)
        )
        return execa('curl', [
          `https://airnow.gov/index.cfm?action=airnow.local_city&zipcode=${zip}&submit=Go`
        ]).then(res => {
          const html = res.stdout.toString()
          const aqiMatch = html.match(/AQDataLg">([a-zA-Z]+)</)
          if (!aqiMatch || !aqiMatch[1]) {
            log({ level: 'error', message: 'no AQI found' })
            log({ level: 'error', message: html })
            throw new Error('unable to find aqi. see logs')
          }
          const level = aqiMatch[1]
          if (level.toLowerCase().trim() === 'good') return true
          throw new Error(`aqi is @ ${level}`)
        })
      }
    }
  ]
}
