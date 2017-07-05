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

const crypto = require('crypto');

/**
 * @summary Safely attach an event listener
 * @function
 * @public
 *
 * @description
 * This is a facade to a couple of standard event
 * handling functions.
 *
 * It makes sure an event listener is not attached
 * twice by first removing the same function from
 * the list of attached listeners if it exists.
 *
 * @param {Object} object - event object
 * @param {String} event - event name
 * @param {Function} handler - event handler
 *
 * @example
 * events.safelyAttachEventListener(electron.ipcMain, 'foo', () => {
 *   console.log('Hello!');
 * });
 */
exports.safelyAttachEventListener = (object, event, handler) => {
  object.removeListener(event, handler);
  object.on(event, handler);
};

/**
 * @summary Generate a random IPC channel name
 * @function
 * @private
 *
 * @param {String} prefix - channel prefix
 * @returns {String} random channel
 *
 * @example
 * const channel = events.generateRandomChannel('foo');
 */
exports.generateRandomChannel = (prefix) => {
  const RANDOM_STRING_BYTES = 16;
  const hash = crypto.randomBytes(RANDOM_STRING_BYTES).toString('hex');
  return `${prefix}-${hash}`;
};

/**
 * @summary Send an event
 * @function
 * @public
 *
 * @param {Object} object - object
 * @param {String} channel - channel
 * @param {Object} data - event data
 * @returns {Promise}
 *
 * @example
 * events.send(electron.ipcRenderer, 'foo', {
 *   bar: 'baz'
 * }).then(() => {
 *   console.log('The message has been awknowledged');
 * });
 */
exports.send = (object, channel, data) => {
  const responseChannel = exports.generateRandomChannel(`${channel}-response`);

  return new Promise((resolve) => {
    object.once(responseChannel, (event, response) => {
      resolve(response);
    });

    object.send(channel, {
      data,
      response: responseChannel
    });
  });
};

/**
 * @summary Awknowledge an event receival
 * @function
 * @public
 *
 * @param {Object} event - ipc message event
 * @param {Object} payload - event payload
 * @param {Object} [data] - data
 *
 * @example
 * electron.ipcMain.on('foo', (event, payload) => {
 *   console.log('Event received!');
 *   events.awknowledge(event, payload);
 * });
 */
exports.awknowledge = (event, payload, data) => {
  event.sender.send(payload.response, data);
};
