const fs = require('fs');

setTimeout(() => {
  console.log('Timer 1');
}, 0);

setImmediate(() => {
  console.log('Immediate 1');
});

fs.readFile('./text.txt', 'utf-8', (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(data);
  setTimeout(() => {
    console.log('Timer 1 in callback');
  }, 0);

  setImmediate(() => {
    console.log('Immediate 1 in callback');
  });
});
