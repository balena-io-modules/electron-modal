electron-modal
==============

> Easily create modals using child browser windows

[![npm version](https://badge.fury.io/js/electron-modal.svg)](http://badge.fury.io/js/electron-modal)
[![dependencies](https://david-dm.org/resin-io/electron-modal.svg)](https://david-dm.org/resin-io/electron-modal.svg)
[![Build Status](https://travis-ci.org/resin-io-modules/electron-modal.svg?branch=master)](https://travis-ci.org/resin-io-modules/electron-modal)
[![Build status](https://ci.appveyor.com/api/projects/status/j98es2eaytr1fc90/branch/master?svg=true)](https://ci.appveyor.com/project/resin-io/electron-modal/branch/master)

Let's face it, using HTML5 modals on Electron applications doesn't provide a
native experience, and `electron-modal` wants to fix that, by allowing you to
easily create and manage application modals built using child browser windows.

```js
// Main process
const { app } = require('electron');
const modal = require('electron-modal');

app.on('ready', () => {

  // Run this on the ready event to setup everything
  // needed on the main process.
  modal.setup();

  // Create browser windows, etc...

});
```

***

```js
// Renderer process
const modal = require('electron-modal');
const path = require('path');

modal.open(path.join(__dirname, 'modal.html'), {

  // Any BrowserWindow options
  width: 400,
  height: 300

}, {

  // Any data you want to pass to the modal
  title: 'electron-modal example'

}).then((instance) => {
  instance.on('increment', () => {
    console.log('Increment event received!');
  });

  instance.on('decrement', () => {
    console.log('Decrement event received!');
  });
});
```

***

```js
// Modal process
const modal = require('electron-modal');

document.getElementById('#increment').addEventListener('click', () => {
  modal.emit('increment').then(() => {
    console.log('The increment event was sent');
  });
});

document.getElementById('#decrement').addEventListener('click', () => {
  modal.emit('decrement').then(() => {
    console.log('The decrement event was sent');
  });
});

modal.getData().then((data) => {

  // Apply the data you passed to the modal
  document.querySelector('h1').innerHTML = data.title;

  // And once we're ready, let's show it!
  modal.show();

});
```

Installation
------------

Install `electron-modal` by running:

```sh
$ npm install --save electron-modal
```

You use the same module in the main and renderer process, which will
automatically expose a different API depending on where it was loaded from.

Documentation
-------------

### Main process

#### `void modal.setup()`

Run this function **after the `ready` event has been emitted** in order to
setup all the IPC event listeners this module needs on the main process in
order to work correctly.

### Renderer process

#### `Promise modal.open(html[, options[, data]])`

Open a modal.

- `html`: path to an HTML file
- `options`: any `BrowserWindow` constructor options
- `data`: any data you want to pass to the modal

This function resolves a modal instance object.

##### Instance methods

- `.show()`: same as `BrowserWindow#show()`
- `.hide()`: same as `BrowserWindow#hide()`
- `.isVisible()`: same as `BrowserWindow#isVisible()`

##### Instance events

- `closed`: when the modal is closed
- `show`: when the modal is shown
- `hide`: when the modal is hidden

The instance may also emit any user event sent with `modal.emit()`, from the
modal process.

### Modal process

#### `void modal.show()`

Show the current modal window. Modal windows are not displayed by default by
this module. The intention is that you process the passed data, and once you're
ready, you call this function.

#### `void modal.hide()`

Hide the current modal window.

#### `Boolean modal.isVisible()`

Check if the current modal window is visible.

#### `Promise modal.getData()`

Get the data object passed to the modal by `modal.open()`.

```js
// Renderer process
modal.open(path.join(__dirname, 'modal.html'), {
  width: 400,
  height: 300
}, {
  number: 1,
  string: 'foo'
});
```

***

```js
// Modal process
modal.getData().then((data) => {
  console.log(data.number);
  console.log(data.string);
});
```

#### `Promise modal.emit(String channel[, Any message])`

Emit a custom event that the renderer process can listen to on the resolved
instance.

- `channel`: the name of the event
- `message`: the event data

```js
// Renderer process
modal.open(path.join(__dirname, 'modal.html'), {
  width: 400,
  height: 300
}).then((instance) => {
  instance.on('hello', (data) => {
    console.log(data.some);
  });
});
```

***

```js
// Modal process
modal.emit('hello', {
  some: 'data'
});
```

Support
-------

If you're having any problem, please [raise an
issue](https://github.com/resin-io-modules/electron-modal/issues/new) on
GitHub and we'll be happy to help.

Tests
-----

Run the test suite by doing:

```sh
$ npm test
```

Contribute
----------

- Issue Tracker:
  [github.com/resin-io-modules/electron-modal/issues](https://github.com/resin-io-modules/electron-modal/issues)
- Source Code:
  [github.com/resin-io-modules/electron-modal](https://github.com/resin-io-modules/electron-modal)

Before submitting a PR, please make sure that you include tests, and that the
linter runs without any warning:

```sh
$ npm run lint
```

License
-------

The project is licensed under the Apache-2.0 license.
