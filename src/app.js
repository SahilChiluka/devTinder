const express = require('express');

const app = express();

app.use("/hello", (req, res) => {
  res.send("Hello from the server!");
});

app.use("/test", (req, res) => {
  res.send("You are on a test page.");
});

app.use("/", (req, res) => {
  res.send("Welcome to Home Page!");
});

app.listen(7777, () => {
  console.log('Server is listening on port 7777.');
});

