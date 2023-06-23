const { request } = require("https");

const req = request("https://www.google.com", (res) => {
  res.on("data", (chunk) => {
    console.log(chunk);

    res.on("end", () => {
      console.log("end");
    });
  });
});

req.end();
