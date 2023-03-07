const fs = require("fs");
const http = require("http");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(data);
});

server.listen(3000, "127.0.0.1", () => {
  console.log("listening to requests on port 3000");
});
