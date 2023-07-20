// index.js
/* eslint-disable */
import { login, logout } from './login.js';
import { updateData } from './userSettings';
import { displayMap } from './mapbox.js';

if (document.querySelector('.form--login')) {
  const loginBtn = document
    .querySelector('.form--login')
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

if (document.querySelector('.nav__el--logout')) {
  document.querySelector('.nav__el--logout').addEventListener('click', logout);
}

const updateDataForm = document.querySelector('.form-user-data');

if (updateDataForm) {
  updateDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateData(name, email);
  });
}
