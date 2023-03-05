const http = require("http"); //buildin module to create server, make http request
const PORT = 3000; //port to listen on
const server = http.createServer((req, res) => {
  //req is the request object(readable stream), res is the response object(writable stream)
  res.writeHead(200, { "Content-Type": "text/plain" }); //send response to client, conten-type is text/plain, content type tells the client what kind of data it is sending, 200 is the status code
  res.end("Hello Worldjk"); // send response to client, end is used to send the response to the client
  //res.end expects a string, so we need to convert it to a string
}); //create server

server.listen(PORT, () => {
  console.log("Server running at http://127.0.0.1:3000/");
}); //listen on port 3000
