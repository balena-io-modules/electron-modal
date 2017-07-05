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

const chai = require('chai');
const utils = require('../../lib/utils');

describe('Renderer Process: Utils', function() {

  describe('.isRenderer()', function() {

    it('should return true', function() {
      chai.expect(utils.isRenderer()).to.be.true;
    });

  });

  describe('.getCurrentBrowserWindow()', function() {

    // TODO: It'd be nice if we can check if this is an
    // actual instance of BrowserWindow, however IPC
    // gets in the middle :(
    it('should return an instance of BrowserWindow', function() {
      chai.expect(utils.getCurrentBrowserWindow()).to.not.be.null;
    });

  });

});
