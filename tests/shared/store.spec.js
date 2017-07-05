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
const store = require('../../lib/store');

describe('Shared: Store', function() {

  describe('.set()', function() {

    it('should be able to store an object', function() {
      const data = {
        foo: 'bar'
      };

      store.delete('foo');
      chai.expect(store.get('foo')).to.deep.equal({});
      store.set('foo', data);
      chai.expect(store.get('foo')).to.deep.equal(data);
    });

    it('should be able to store an empty object', function() {
      store.delete('foo');
      chai.expect(store.get('foo')).to.deep.equal({});
      store.set('foo', {});
      chai.expect(store.get('foo')).to.deep.equal({});
    });

    it('should support number ids', function() {
      const data = {
        foo: 'bar'
      };

      store.delete(1);
      chai.expect(store.get(1)).to.deep.equal({});
      store.set(1, data);
      chai.expect(store.get(1)).to.deep.equal(data);
    });

  });

  describe('.get()', function() {

    it('should return an empty object if no data', function() {
      store.delete('foo');
      chai.expect(store.get('foo')).to.deep.equal({});
    });

    it('should return a cloned version of the data', function() {
      const data = {
        foo: 'bar'
      };

      store.set('foo', data);

      data.foo = 'baz';

      chai.expect(store.get('foo')).to.deep.equal({
        foo: 'bar'
      });

      data.foo = 'qux';

      chai.expect(store.get('foo')).to.deep.equal({
        foo: 'bar'
      });
    });

  });

  describe('.delete()', function() {

    it('should delete any existing data', function() {
      store.set('foo', {
        bar: 'baz'
      });

      store.delete('foo');
      chai.expect(store.get('foo')).to.deep.equal({});
    });

  });

});
