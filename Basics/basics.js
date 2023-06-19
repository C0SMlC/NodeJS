const fs = require('fs');

const textIn = fs.readFileSync('./text.txt', 'utf-8');

console.log(textIn);

const output = `Here is the text that we read = ${textIn}. \nCreated on: ${Date.now()}`;

fs.writeFileSync('./output.txt', output);
