// index.js

import '@babel/polyfill';
import { displayMap } from './mapbox.js';
import { login } from './login.js';

const loginBtn = document
  .querySelector('.form')
  .addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
  });

if (document.getElementById('map')) {
  const locations = JSON.parse(document.getElementById('map').dataset.location);
  displayMap(locations);
}
