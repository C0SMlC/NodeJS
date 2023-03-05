const http = require("http"); //buildin module to create server, make http request
const PORT = 3000; //port to listen on

const server = http.createServer((req, res) => {
  if (req.url === "/html") {
    res.writeHead(200, { "Content-Type": "text/html" }); //send response to client, conten-type is text/plain, content type tells the client what kind of data it is sending, 200 is the status code
    res.end("<h1>Hello World</h1>"); // send response to client, end is used to send the response to the client
  } else if (req.url === "/json") {
    res.writeHead(200, { "Content-Type": "application/json" }); //application/json is the content type for object, 200 is the status code
    res.end(
      JSON.stringify({
        id: 1,
        name: "Pratik Pendurkar",
        age: 20,
      })
    ); // send response to client, end is used to send the response to the client
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" }); //send response to client, conten-type is text/plain, content type tells the client what kind of data it is sending, 200 is the status code
    res.end("Page not found"); // send response to client, end is used to send the response to the client
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
