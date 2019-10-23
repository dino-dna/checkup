# checkup

run and visualize status checks.

<span style='text-align: center;width: 100%; display: block;margin: auto;'>
  <img style='display: block;' width='100px' src='./img/statusicon.png' />
  <img style='display: block;' width='400px' src='./img/window.png' />
</span>

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


### api

#### config.js

- export a configure function, `module.exports.configure = (toolkit) => [ ...checks ]`
- each check (internally called a `Job`), has the following type signature:

```ts
type Job = {
  name: string
  fn: () => JobResponsePrimative | Promise<JobResponsePrimative>
  pollDurationMs?: number
  state: { ... } // @private. do not try to set or use `state`
}
type JobResponsePrimative = boolean | string
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
