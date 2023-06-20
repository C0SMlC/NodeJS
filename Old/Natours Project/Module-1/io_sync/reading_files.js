const fs = require("fs");

const textIn = fs.readFile("text.txts", "utf-8", (err, data) => {
  if (err) {
    console.log("No file found");
    return;
  }
  console.log(data);
});
