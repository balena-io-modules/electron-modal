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

const modal = require('../..');

// We're calling modal.getData() over and over again
// to ensure the data is still accessible even after
// we delete it from the main process.

const JSON_INDENTATION = 2;
document.querySelector('pre').innerHTML = '';

modal.getData().then((data) => {
  console.log(data);
  document.querySelector('pre').innerHTML += JSON.stringify(data, null, JSON_INDENTATION);
  return modal.getData();
}).then((data) => {
  document.querySelector('pre').innerHTML += '\n';
  document.querySelector('pre').innerHTML += JSON.stringify(data, null, JSON_INDENTATION);
  return modal.getData();
}).then((data) => {
  document.querySelector('pre').innerHTML += '\n';
  document.querySelector('pre').innerHTML += JSON.stringify(data, null, JSON_INDENTATION);
  return modal.show();
});
