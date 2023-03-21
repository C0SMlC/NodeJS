// Routing in nodeJS- Routing means implementing different actions for different parts of URL
// for example www.amazon.com shows different response
// www.amazon.com/shoes will produce different action

const http = require("http");
const url = require("url");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const PATH = req.url;
  if (PATH === "/product") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Product Page</h1>");
  } else if (PATH === "/shop") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Shop Page</h1>");
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>Page Not Found</h1>");
  }
});

server.listen(3000, () => {

  console.log("Server is running on port 3000");

  
});
