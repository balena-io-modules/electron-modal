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

const path = require('path');
const modal = require('..');

const modalData = {

  data: {
    title: 'If you see this 3 times, it works'
  },

  'no-data': {}

};

document.querySelectorAll('button').forEach((element) => {
  element.addEventListener('click', (event) => {
    const id = event.srcElement.id;
    const fileName = path.join(__dirname, 'cases', `${id}.html`);
    console.log(`Opening ${fileName}`);
    modal.open(fileName, {
      width: 400,
      height: 300
    }, modalData[id]).then((instance) => {
      instance.on('answer', (answer) => {
        console.log('Received answer', answer);
      });
    });
  });
});

