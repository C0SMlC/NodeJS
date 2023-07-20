export const showAlert = (message, className) => {
  hideAlert();
  // Create markup
  const markUp = `<div class="alert alert--${className}">${message}</div>`;
  // Insert alert
  document.querySelector('body').insertAdjacentHTML('afterbegin', markUp);
  // hide alert
  window.setTimeout(hideAlert, 5000);
};

export function hideAlert() {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
}
