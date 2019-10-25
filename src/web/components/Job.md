```jsx
<>
  <Job
    job={{
      name: 'Cool skateboard tricks',
      state: {
        nextRunDate: new Date(Date.now() + 60 * 60 * 1000),
        status: 'ok',
      }
    }}
  />
  <Job
    job={{
      name: 'Big flops',
      state: {
        message: 'There was an error',
        nextRunDate: new Date(Date.now() + 60),
        status: 'not_ok',
      }
    }}
  />
  <Job
    job={{
      name: 'Watchu doin',
      state: {
        lastSuccess: 'this succeeded a while ago',
        status: 'who knows dawg',
        nextRunDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }
    }}
  />
</>
