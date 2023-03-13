// NodeJS is a multi-core JavaScript runtime environment, which has event driven architecture
// that means an event is fired as soon as a certain condition is met.

const eventEmmitter = require('events');

const myEmitter = new eventEmmitter();

myEmitter.on('myEvent', () => {
  console.log('Event fired');
});

myEmitter.emit('myEvent');
//  Can pass multiple arguments in this function

myEmitter.on('myEventWithArgument', (arg1, arg2) => {
  console.log(arg1, arg2);
});

myEmitter.emit('myEventWithArgument', 'Hello', 'World!');

// But rather than doing this we can directly inherit from the events module

class sales extends eventEmmitter {
  constructor() {
    super();
  }
}

const newEmitter = new sales();

newEmitter.on('myEvent', () => {
  console.log('Event fired using inheritance');
});

newEmitter.emit('myEvent');

// HTTP module using Events;

const http = require('http');

const server = http.createServer();

server.on('request', (req, res) => {
  console.log('Request received');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
