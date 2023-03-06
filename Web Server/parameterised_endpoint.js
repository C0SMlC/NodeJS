const http = require("http");

const PORT = 3000;

const freinds = [
  {
    id: 0,
    name: "John",
  },
  {
    id: 1,
    name: "Jane",
  },
];

const server = http.createServer((req, res) => {
  const items = req.url.split("/");
  if (items[2] <= freinds.length) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(freinds[items[2]]));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
