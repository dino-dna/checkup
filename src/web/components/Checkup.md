```jsx
<Checkup
  onConfigure={console.log}
  state={{
    main: {
      jobs: {
        'job-1': {
          name: 'Cool skateboard tricks',
          state: {
            nextRunDate: new Date(Date.now() + 60 * 60 * 1000),
            status: 'ok',
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