// app.js
const express = require('express');
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Route test
app.get('/', (req, res) => {
  res.send('Hello MazeMind Backend!');
});

module.exports = app; // très important