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
const chai = require('chai');
const utils = require('../../lib/utils');

describe('Main Process: Utils', function() {

  describe('.isRenderer()', function() {

    it('should return false', function() {
      chai.expect(utils.isRenderer()).to.be.false;
    });

  });

  describe('.getCurrentBrowserWindow()', function() {

    it('should return null', function() {
      chai.expect(utils.getCurrentBrowserWindow()).to.be.null;
    });

  });

  describe('.getBrowserWindowId()', function() {

    it('should return a positive number', function() {
      let browserWindow = new electron.BrowserWindow();
      const id = utils.getBrowserWindowId(browserWindow);
      chai.expect(typeof id).to.equal('number');
      chai.expect(id >= 0).to.be.true;
      browserWindow = null;
    });

    it('should return different ids for different BrowserWindow instances', function() {
      let window1 = new electron.BrowserWindow();
      let window2 = new electron.BrowserWindow();
      let window3 = new electron.BrowserWindow();

      const id1 = utils.getBrowserWindowId(window1);
      const id2 = utils.getBrowserWindowId(window2);
      const id3 = utils.getBrowserWindowId(window3);

      chai.expect(id1).to.not.equal(id2);
      chai.expect(id2).to.not.equal(id3);
      chai.expect(id3).to.not.equal(id1);

      window1 = null;
      window2 = null;
      window3 = null;
    });

  });

  describe('.isChildBrowserWindow()', function() {

    it('should return false if the browser window is not a child window', function() {
      let browserWindow = new electron.BrowserWindow();
      chai.expect(utils.isChildBrowserWindow(browserWindow)).to.be.false;
      browserWindow = null;
    });

    it('should return true if the browser window is a child window', function() {
      let browserWindow = new electron.BrowserWindow();
      let childWindow = new electron.BrowserWindow({
        parent: browserWindow
      });

      chai.expect(utils.isChildBrowserWindow(childWindow)).to.be.true;
      childWindow = null;
      browserWindow = null;
    });

  });

});
