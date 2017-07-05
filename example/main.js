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
const path = require('path');
const url = require('url');
const modal = require('..');

let browserWindow = null;

electron.app.on('ready', () => {

  // Run this on the ready event to setup everything
  // needed on the main process.
  modal.setup();

  browserWindow = new electron.BrowserWindow({
    width: 600,
    height: 200
  });

  browserWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  browserWindow.webContents.openDevTools();

  browserWindow.on('closed', () => {
    browserWindow = null;
  });
});

electron.app.on('window-all-closed', electron.app.quit);
