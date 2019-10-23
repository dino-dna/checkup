No jobs:

```jsx
<Statuses
  jobs={[]}
/>
```

Some jobs:

```jsx
<Statuses
  jobs={[{
    name: 'Cool skateboard tricks',
    state: {
      nextRunDate: new Date(Date.now() + 60 * 60 * 1000),
      status: 'ok',
    }
  }, {
    name: 'Big flops',
    state: {
      nextRunDate: new Date(Date.now() + 60),
      status: 'not_ok',
    }
  }, {
    name: 'Watchu doin',
    state: {
      status: 'who knows dawg',
      nextRunDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }
  }]}
/>
```