const fs = require('fs');
const server = require('http').createServer();

const readable = fs.createReadStream('./test.txt', { encoding: 'utf8' });

/// rather than loading all the data in main memory data is loadded in the form of chunks


readable.on('data', (chunk) => {
  console.log(chunk);
});

// but ths cretes problem known as backpressure
// In Node.js, streams are a fundamental concept that enable efficient processing of data,
// especially when dealing with large data sets. However, one common problem that can occur with Node.js streams is backpressure.

// Backpressure occurs when the speed at which data is being read from a readable stream is slower than the speed at which it is
// being written to a writable stream. This can cause the writable stream to fill up with data that has not yet been processed,
// which can lead to increased memory usage and, ultimately, crashes or other errors in the application.
//hence we use pipe method which is used to read data from a readable stream and write it to a writable stream.

//readable source.pipe(writeble destination) IMP:

server.on('request', (req, res) => {
  readable.pipe(res);
});

server.listen(3000, () => {
  console.log('server is running on port 3000');
});
