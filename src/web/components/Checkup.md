```jsx
<Checkup
  onConfigure={console.log}
  state={{
    main: {
      state: 'OK',
      jobs: {
        'job-1': {
          name: 'Cool skateboard tricks, but perhaps an extra long name that doesn\'t fit?',
          state: {
            nextRunDate: new Date(Date.now() + 60 * 60 * 1000),
            status: 'ok',
          }
        },
        'job-2': {
          name: 'Big flops',
          state: {
            message: `Error: I've made a huge mistake
    at /Users/creed/dev/checkup/throw.js:2:9
    at Object.<anonymous> (/Users/creed/dev/checkup/throw.js:3:3)
    at Module._compile (internal/modules/cjs/loader.js:778:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:789:10)
    at Module.load (internal/modules/cjs/loader.js:653:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:593:12)
    at Function.Module._load (internal/modules/cjs/loader.js:585:3)
    at Function.Module.runMain (internal/modules/cjs/loader.js:831:12)
    at startup (internal/bootstrap/node.js:283:19)
    at bootstrapNodeJSCore (internal/bootstrap/node.js:622:3)`,
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
