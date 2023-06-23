const http = require("http"); //buildin module to create server, make http request
const server = http.createServer((req, res) => {
  //req is the request object(readable stream), res is the response object(writable stream)
  res.writeHead(200, { "Content-Type": "application/json" }); // application/json is the content type for object, 200 is the status code
  //send response to client, conten-type is text/plain, content type tells the client what kind of data it is sending, 200 is the status code
  res.end(
    JSON.stringify({
      id: 1,
      name: "Pratik Pendurkar",
      age: 20,
    })
  ); // send response to client, end is used to send the response to the client
  //res.end expects a string, so we need to convert it to a string
});

server.listen(3000, () => {
  console.log("Server running at http://127.0.0.1:3000/");
});
