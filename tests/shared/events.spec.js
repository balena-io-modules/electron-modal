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
const EventEmitter = require('events').EventEmitter;
const events = require('../../lib/events');

describe('Shared: Events', function() {

  describe('.safelyAttachEventListener()', function() {

    it('should not attach the same event listener twice', function() {
      const emitter = new EventEmitter();
      const handler = () => {
        return 'foo';
      };

      events.safelyAttachEventListener(emitter, 'foo', handler);
      events.safelyAttachEventListener(emitter, 'foo', handler);
      events.safelyAttachEventListener(emitter, 'foo', handler);
      events.safelyAttachEventListener(emitter, 'foo', handler);
      chai.expect(emitter.listenerCount('foo')).to.equal(1);
    });

    it('should keep unrelated event listeners intact', function() {
      const emitter = new EventEmitter();
      const handler = () => {
        return 'foo';
      };

      events.safelyAttachEventListener(emitter, 'foo', handler);
      events.safelyAttachEventListener(emitter, 'foo', handler);
      events.safelyAttachEventListener(emitter, 'bar', handler);
      events.safelyAttachEventListener(emitter, 'baz', handler);
      chai.expect(emitter.listenerCount('foo')).to.equal(1);
      chai.expect(emitter.listenerCount('bar')).to.equal(1);
      chai.expect(emitter.listenerCount('baz')).to.equal(1);
    });

  });

  describe('.generateRandomChannel()', function() {

    it('should generate a channel that starts with the passed prefix', function() {
      const channel = events.generateRandomChannel('foo');
      chai.expect(channel.startsWith('foo-')).to.be.true;
      chai.expect(channel).to.not.equal('foo-');
    });

    it('should generate a random channel', function() {
      const channel1 = events.generateRandomChannel('foo');
      const channel2 = events.generateRandomChannel('foo');
      const channel3 = events.generateRandomChannel('foo');
      const channel4 = events.generateRandomChannel('foo');
      const channel5 = events.generateRandomChannel('foo');

      chai.expect(channel1).to.not.equal(channel2);
      chai.expect(channel2).to.not.equal(channel3);
      chai.expect(channel3).to.not.equal(channel4);
      chai.expect(channel4).to.not.equal(channel5);
      chai.expect(channel5).to.not.equal(channel1);
    });

  });

});
