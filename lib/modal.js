/*
 * Copyright 2017 resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const electron = require('electron');
const EventEmitter = require('events').EventEmitter;
const utils = require('./utils');
const store = require('./store');
const events = require('./events');
const packageJSON = require('../package.json');

/**
 * @summary The IPC channel name to get data from the model data store
 * @type {String}
 * @constant
 */
const IPC_CHANNEL_DATA_GET = `${packageJSON.name}-data-get`;

/**
 * @summary The IPC channel name to set data to the model data store
 * @type {String}
 * @constant
 */
const IPC_CHANNEL_DATA_SET = `${packageJSON.name}-data-set`;

/**
 * @summary The IPC channel to bridge messages between renderer processes
 * @type {String}
 * @constant
 */
const IPC_CHANNEL_MESSAGE_BRIDGE = `${packageJSON.name}-message-bridge`;

/**
 * @summary Main process environment variable to signify that electron-modal is ready
 * @type {String}
 * @constant
 */
const ENVIRONMENT_VARIABLE_SETUP_FLAG = 'ELECTRON_MODAL_SETUP';

/**
 * @summary The BrowserWindow event channel used to receive custom messages
 * @type {String}
 * @constant
 */
const CHANNEL_BROWSER_WINDOW_MESSAGE = `${packageJSON.name}-modal-message`;

// We export different functions depending where we're running.
// The "modes" currently are:
//
// - Main process
// - Master renderer process
// - Child renderer process
//
// We could of course expose all the functions everywhere, and
// teach the user to only use them when appropriate, however
// the API becomes crystal clear after making these divisions.

if (utils.isRenderer()) {

  // Note that these variables points to different things
  // depending on where this file was evaluated.
  //
  // It is the master window when loaded in a user's renderer
  // process, but its the modal itself, otherwise.
  const currentWindow = utils.getCurrentBrowserWindow();
  const currentWindowId = utils.getBrowserWindowId(currentWindow);

  // This obviously means we don't allow child browser
  // windows to open their own modals, but I found that
  // such use case doesn't occur in practice very much
  if (utils.isChildBrowserWindow(currentWindow)) {

    // Bridge some of the browser window methods, for convenience
    exports.show = currentWindow.show;
    exports.hide = currentWindow.hide;
    exports.isVisible = currentWindow.isVisible;

    // We need to memoize this function, given that the modal data
    // is deleted from the main process store once we retrieve it
    exports.getData = utils.blindMemoize(() => {
      return events.send(electron.ipcRenderer, IPC_CHANNEL_DATA_GET, currentWindowId);
    });

    exports.emit = (channel, message) => {
      return events.send(electron.ipcRenderer, IPC_CHANNEL_MESSAGE_BRIDGE, {
        id: currentWindowId,
        channel,
        message
      });
    };
  } else {
    exports.open = (html, options, data = {}) => {

      // We need to communicate through certain IPC channels with the
      // main process, we must be sure everything is setup before
      // continuing, otherwise the user will experience hard-to-debug
      // renderer process hangs.
      if (!process.env[ENVIRONMENT_VARIABLE_SETUP_FLAG]) {
        throw new Error('Make sure you ran modal.setup() on the main process before calling this function');
      }

      const emitter = new EventEmitter();

      let modalWindow = new electron.remote.BrowserWindow(Object.assign({}, options, {

        // We rely on a parent/child relationship between windows to
        // identify what is a "modal", we must make sure the user
        // can't override this setting.
        parent: currentWindow,

        // Instantly showing the window will not provide a good UX
        // in almost all scenarios, so force the user to take
        // responsibility by making him show the window himself.
        show: false

      }));

      // Expose certain BrowserWindow methods for convenience

      emitter.show = modalWindow.show;
      emitter.hide = modalWindow.hide;
      emitter.isVisible = modalWindow.isVisible;

      // Bridge these events for convenience

      modalWindow.on('closed', () => {
        modalWindow = null;
        emitter.emit('closed');
      });

      modalWindow.on('show', () => {
        emitter.emit('show');
      });

      modalWindow.on('hide', () => {
        emitter.emit('hide');
      });

      // Handle custom events coming from the child window

      modalWindow.on(CHANNEL_BROWSER_WINDOW_MESSAGE, (payload) => {
        emitter.emit(payload.channel, payload.message);
      });

      return events.send(electron.ipcRenderer, IPC_CHANNEL_DATA_SET, {
        id: utils.getBrowserWindowId(modalWindow),
        data
      }).then(() => {
        modalWindow.loadURL(utils.getFileURL(html));
        return emitter;
      });
    };
  }
} else {

  /**
   * @summary Set modal data through IPC
   * @function
   * @private
   *
   * @param {Object} event - event
   * @param {Object} payload - payload
   */
  const setData = (event, payload) => {
    store.set(payload.data.id, payload.data.data);
    events.awknowledge(event, payload);
  };

  /**
   * @summary Get modal data through IPC
   * @function
   * @private
   *
   * @description
   * This function deletes the data from the store once
   * it has been passed to the renderer process, forcing
   * it to cache its value instead of accessing it through
   * IPC, which is very slow.
   *
   * @param {Object} event - event
   * @param {Object} payload - payload
   */
  const getData = (event, payload) => {
    const data = store.get(payload.data);
    store.delete(payload.data);
    events.awknowledge(event, payload, data);
  };

  /**
   * @summary Bridge an IPC message from a modal to its parent
   * @function
   * @private
   *
   * @param {Object} event - event
   * @param {Object} payload - payload
   */
  const bridge = (event, payload) => {
    electron.BrowserWindow.fromId(payload.data.id).emit(CHANNEL_BROWSER_WINDOW_MESSAGE, {
      channel: payload.data.channel,
      message: payload.data.message
    });

    events.awknowledge(event, payload);
  };

  exports.setup = () => {
    if (process.env[ENVIRONMENT_VARIABLE_SETUP_FLAG]) {
      return;
    }

    // Let the renderer processes know we're ready to start modals
    process.env[ENVIRONMENT_VARIABLE_SETUP_FLAG] = true;

    events.safelyAttachEventListener(electron.ipcMain, IPC_CHANNEL_DATA_SET, setData);
    events.safelyAttachEventListener(electron.ipcMain, IPC_CHANNEL_DATA_GET, getData);
    events.safelyAttachEventListener(electron.ipcMain, IPC_CHANNEL_MESSAGE_BRIDGE, bridge);
  };
}
