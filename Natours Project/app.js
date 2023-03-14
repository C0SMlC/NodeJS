const express = require('express');

const app = express();
const PORT = 3000;

// app.get('/', (req, res) => {
//   res.status(200).send('<h1>Hello World!</h1>');
// });

app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Pratik',
    work: 'coding',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
