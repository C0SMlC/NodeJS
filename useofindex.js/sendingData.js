"use strict";

const { encrptedData, decryptedData } = require("./Internals");

const sendData = function (data) {
  console.log(encrptedData(data));
  console.log(decryptedData(data));
};

sendData("Pratik");
