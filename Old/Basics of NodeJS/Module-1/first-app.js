"use strict";
const string = global.process.argv[2];

function grettings(str) {
  str == "Hello" ? console.log("Hello") : console.log("Hi");
}

grettings(string);
