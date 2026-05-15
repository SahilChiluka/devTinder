const express = require('express');

const app = express();

app.use("/", (req, res) => {
  res.send("Welcome to Home Page!");
});

// This will only handle GET call to /user
app.get("/user", (req, res) => {
  res.send({firstName: "Sahil", lastName: "Chiluka"});
});

app.post("/user", (req, res) => {
  console.log("Saving User into Database");
  res.send("User Saved Successfully");
});

app.delete("/user", (req, res) => {
  res.send("Deleted User Successfully");
});

// If you do "app.use" This will match all the HTTP methods (GET, POST, DELETE, etc) to /test
app.use("/test", (req, res) => {
  res.send("You are on a test page.");
});

app.listen(7777, () => {
  console.log('Server is listening on port 7777.');
});

