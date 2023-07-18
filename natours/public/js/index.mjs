/* eslint-disable*/
import 'babel/polyfill'
import { login } from './login.mjs';

const loginBtn = document
  .querySelector('.form')
  .addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
  });

