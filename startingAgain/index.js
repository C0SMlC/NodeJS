const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const { query } = url.parse(req.url, true);
  console.log(query);
  if (req.url === '/' || req.url === '/home') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Home Page</h1>');
  } else if (req.url === '/recipe') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Recipe Page</h1>');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>Not Found</h1>');
  }
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Server is running on port 3000');
});
