# checkup

run and visualize status checks

<div style='text-align: center;width: 100%; margin: auto;'>
  <img width='100px' src='./img/statusicon.png' />
</div>
<div style='text-align: center;width: 100%; margin: auto;'>
  <img width='400px' src='./img/window.png' />
</div>

shows your health as a statusbar icon, and updates in realtime.

check your network service.  check your system daemons.  check your hardware.  check heartbeats, or check workflows.  check with scripts, check with binaries, check with docker, check with `<whatever>`.  we don't care what you check, we just provide a small interface and ui to present those checks in :)

## install

download the application from the [releases page, here](https://github.com/dino-dna/checkup/releases), for your operating system

## usage

upon installation, you already have a working instance, with dummy checks installed and running.  let's add your own.

- open the app, and click the configure button
- open the `config.js` file in the opened directory
  - a template is included to help you get started
- write some checks. `config.js` should export a function named `configure` that returns an array of checks:

```ts
// minimal config
module.exports.configure = (ctx) =>
  [{ name: 'random-check', fn: () => Math.random() > 0.5 }]
```

- save.
- click the `checkup` tray icon, and open/close the window
  - toggling the window should reload your checks
  - observe your new checks loaded!
- enjoy

### launch on startup

if you would like `checkup` to start when your mac starts up, go to `System Preferences > Users and Groups` and add `checkup.app` to "Login Items" for your user

### api

#### config.js

- export a `configure` function with signature:

  - `module.exports.configure = (toolkit) => [ ...jobs ]`, or
  - `module.exports.configure = (toolkit) => { iconTheme: ..., jobs: [ ...jobs ] }`
    - `iconTheme`: `'stencil_dark'`, `'stencil'`, `'github'`
    - `jobs`: each `Job has the following type signature:

```ts
type Job = {
  name: string
  fn: (jobCtx: JobCtx) => JobResponsePrimative | Promise<JobResponsePrimative>
  pollDurationMs?: number // default: 10 minutes (60000 * 10)
  state: { ... } // @private. do not try to set or use `state`
}
type JobResponsePrimative = boolean | string
type JobCtx = { log: Logger } // log({ level: 'warn|info|error', message: 'my job is the best!' })
```

see above for examples.

#### toolkit

configure receives a `toolkit` object, which has a few modules embedded:

- `toolkit.fs` - filesystem io - https://www.npmjs.com/package/fs-extra
- `toolkit.fetch` - network/http io - https://www.npmjs.com/package/node-fetch
- `toolkit.execa` - child process io - https://www.npmjs.com/package/execa

because so many health check operations are centered around local and remote i/o, these dependencies are injected for your convenience.

### not into javascript?

not a js fan? or, perhaps you just want to run some other binary?
no problem--just fire off a subprocess to run _your thing_. you can `require('child_process')` and use that, but i strongly advise using `execa`, which is passed in for you:

```js
// config.js
// @example - child process
module.exports.configure = ({ execa }) => [{
  name: 'disk-check',
  fn: () => execa('fsck', ['-fy', '/dev/sda2'])
}]
```

## contributing

### bootstrap

- `nvm use`
- `yarn`
- `yarn build:watch`
  - starts the compiler and the web bundler
- `yarn electron` from another shell. alternatively, use the VSCode launch configuration to boot the app
