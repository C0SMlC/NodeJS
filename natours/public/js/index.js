// index.js
/* eslint-disable */
import { login } from './login.js';
import { displayMap } from './mapbox.js';

if (document.querySelector('.form')) {
  const loginBtn = document
    .querySelector('.form')
    .addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;
      login(email, password);
    });
}

if (document.getElementById('map')) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );
  displayMap(locations);
}
