const fs = require("fs");

const textIN = fs.readFileSync("text.txt", "utf-8");

const writeString = `The content pof the file is: ${textIN}, created on ${new Date()}`;

fs.writeFileSync("text.txt", writeString);