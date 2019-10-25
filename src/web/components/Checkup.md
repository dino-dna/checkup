```jsx
<Checkup
  onConfigure={console.log}
  state={{
    main: {
      state: 'OK',
      jobs: {
        'job-1': {
          name: 'Cool skateboard tricks',
          state: {
            nextRunDate: new Date(Date.now() + 60 * 60 * 1000),
            status: 'ok',
          }
        },
        'job-2': {
          name: 'Big flops',
          state: {
            message: 'There was an error',
            nextRunDate: new Date(Date.now() + 60),
            status: 'not_ok',
          }
        },
        'job-3': {
          name: 'Watchu doin',
          state: {
            lastSuccess: 'this succeeded a while ago',
            status: 'who knows dawg',
            nextRunDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          }
        }
      }
    }
  }}
/>
```

With an error:

```jsx
<Checkup
  onConfigure={console.log}
  state={{
    main: {
      errorMessage: 'oh, no'
    }
  }}
/>
```
