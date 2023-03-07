const fs = require("fs");

fs.readFile("gateway.txt", "utf-8", (err, data) => {
  console.log(data);
  fs.readFile(`${data}`, "utf-8", (err, data1) => {
    console.log(data1);
  });
});
