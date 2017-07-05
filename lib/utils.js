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
const url = require('url');
const isRenderer = require('is-electron-renderer');

/**
 * @summary Check if the current process is a renderer process
 * @function
 * @public
 *
 * @returns {Boolean} whether the current process is a renderer process
 *
 * @example
 * if (utils.isRenderer()) {
 *   console.log('This is a renderer process');
 * }
 */
exports.isRenderer = () => {
  return isRenderer;
};

/**
 * @summary Get a file URL out of a file path
 * @function
 * @public
 *
 * @param {String} filePath - file path
 * @returns {String} file url
 *
 * @example
 * const url = utils.getFileURL(path.join(__dirname, 'index.html'));
 */
exports.getFileURL = (filePath) => {
  return url.format({
    pathname: filePath,
    protocol: 'file:',
    slashes: true
  });
};

/**
 * @summary Get the current browser window instance
 * @function
 * @public
 *
 * @returns {(Object|Null)} the current browser window instance
 *
 * @example
 * const browserWindow = utils.getCurrentBrowserWindow();
 */
exports.getCurrentBrowserWindow = () => {
  return exports.isRenderer() ? electron.remote.getCurrentWindow() : null;
};

/**
 * @summary Get the id of a browser window instance
 * @function
 * @public
 *
 * @param {Object} browserWindow - browser window instance
 * @returns {Number} the browser window id
 *
 * @example
 * const browserWindow = new electron.BrowserWindow();
 * const id = utils.getBrowserWindowId(browserWindow);
 */
exports.getBrowserWindowId = (browserWindow) => {
  return browserWindow.id;
};

/**
 * @summary Check of a browser instance is a child window
 * @function
 * @public
 *
 * @param {Object} browserWindow - browser window instance
 * @returns {Boolean} whether the browser window is a child window
 *
 * @example
 * const browserWindow = new electron.BrowserWindow();
 * const childWindow = new electron.BrowserWindow({
 *   parent: browserWindow
 * });
 *
 * if (utils.isChildBrowserWindow(childWindow)) {
 *   console.log('This is a child browser window');
 * }
 */
exports.isChildBrowserWindow = (browserWindow) => {
  return Boolean(browserWindow.getParentWindow());
};

/**
 * @summary Blindly memoize a function
 * @function
 * @public
 *
 * @description
 * This means that after the first execution, the memoized
 * function will *always* return the same result, no
 * matter the arguments.
 *
 * @param {Function} func - function
 * @returns {Function} bindly memoized function
 *
 * @example
 * const func = utils.blindMemoize(() => {
 *   return Math.random();
 * });
 */
exports.blindMemoize = (func) => {
  let cache = null;
  return (...args) => {
    if (!cache) {
      cache = Reflect.apply(func, this, args);
    }

    return cache;
  };
};
