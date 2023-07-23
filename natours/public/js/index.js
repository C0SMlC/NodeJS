// index.js
/* eslint-disable */
import { login, logout } from './login.js';
import { updateData } from './userSettings';
import { displayMap } from './mapbox.js';
import { bookTour } from './stripe.js';

const updateDataForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-settings');
const bookBtn = document.querySelector('#book-tour');

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

if (updateDataForm) {
  updateDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateData(form, 'me');
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;

    updateData({ currentPassword, password, confirmPassword }, 'passowrd');
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', function (e) {
    e.target.textContent = 'processing...';
    const tourId = e.target.dataset.tourid;
    bookTour(tourId);
  });
}
