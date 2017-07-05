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

/**
 * @summary Object to store modal data
 * @type {Object}
 * @constant
 */
const store = {};

/**
 * @summary Deep clone an object
 * @function
 * @private
 *
 * @param {Object} object - object
 * @returns {Object} cloned object
 *
 * @example
 * const clonedObject = deepClone({
 *   foo: 'bar'
 * });
 */
const deepClone = (object) => {

  // See https://stackoverflow.com/a/28222333/1641422
  return JSON.parse(JSON.stringify(object));

};

/**
 * @summary Set data for a certain id
 * @function
 * @public
 *
 * @param {(String|Number)} id - id
 * @param {Object} data - data
 *
 * @example
 * store.set('foo', {
 *   bar: 'baz'
 * });
 */
exports.set = (id, data) => {
  store[id] = deepClone(data);
};

/**
 * @summary Get data for a certain id
 * @function
 * @public
 *
 * @param {(String|Number)} id - id
 * @returns {Object} data
 *
 * @example
 * const data = store.get('foo');
 */
exports.get = (id) => {
  return deepClone(store[id] || {});
};

/**
 * @summary Delete data of a certain id
 * @function
 * @public
 *
 * @param {(String|Number)} id - id
 *
 * @example
 * store.delete('foo');
 */
exports.delete = (id) => {
  Reflect.deleteProperty(store, id);
};
