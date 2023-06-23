const http = require("http");
const server = http.createServer((req, res) => {
  if (req.url === "/text") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    // res.writeHead(200, { "Content-Type": "text/plain" }); equivalent to above used method

    res.end("Hello World");
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>My First Page</title></head>");
    res.write("<body><h1>Hello World</h1></body>");
    res.write("</html>");
    res.end();
  }
});

server.listen(2000, () => {
  console.log("Server is running on port 2000");
});
