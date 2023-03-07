"use strict";

const { encrptedData } = require("./encruptingDats");
const { decryptedData } = require("./decyptingDats");

const sendData = function (data) {
  console.log(encrptedData(data));
  console.log(decryptedData(data));
};

sendData("Pratik");
