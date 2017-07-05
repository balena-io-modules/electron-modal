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
const path = require('path');
const os = require('os');
const utils = require('../../lib/utils');

describe('Shared: Utils', function() {

  describe('.getFileURL()', function() {

    it('should return a file URL', function() {
      const htmlFile = path.join(__dirname, 'index.html');
      if (os.platform() === 'win32') {
        chai.expect(utils.getFileURL(htmlFile)).to.equal(`file:///${htmlFile}`);
      } else {
        chai.expect(utils.getFileURL(htmlFile)).to.equal(`file://${htmlFile}`);
      }
    });

  });

  describe('.blindMemoize()', function() {

    it('should blindly memoize a function without arguments', function() {
      const func = () => {
        return Math.random();
      };

      const memoized = utils.blindMemoize(func);
      const value = memoized();
      chai.expect(typeof value).to.equal('number');

      const value1 = memoized();
      const value2 = memoized();
      const value3 = memoized();

      chai.expect(value1).to.equal(value);
      chai.expect(value2).to.equal(value);
      chai.expect(value3).to.equal(value);
    });

    it('should blindly memoize a function with arguments', function() {
      const func = (times) => {
        let result = '';
        let counter = times;

        while (counter > 0) {
          result += 'x';
          counter -= 1;
        }

        return result;
      };

      const memoized = utils.blindMemoize(func);
      const length = Math.floor(Math.random() * 10);
      const value = memoized(length);
      chai.expect(value.length).to.equal(length);

      const value1 = memoized(15);
      const value2 = memoized(50);
      const value3 = memoized(25);

      chai.expect(value1).to.equal(value);
      chai.expect(value2).to.equal(value);
      chai.expect(value3).to.equal(value);
    });

  });

});
