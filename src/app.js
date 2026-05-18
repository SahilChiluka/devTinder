const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  res.send("Send All Data");
});

app.get("/admin/deleteAllData", (req, res) => {
  res.send("Delete All Data");
});

app.use("/", (err, req, res, next) => {
  if(err) {
    res.status(500).send("Something went wrong!");  // Send a 500 Internal Server Error response
  }
})

app.get("/user/getUserData", userAuth, (req, res) => {
  // throw new Error("User data retrieval failed!");  // Simulate an error for testing error handling
  res.send("Send User Data");
})

// app.use("/", (err, req, res, next) => {
//   if(err) {
//     res.status(500).send("Error: Something went wrong!");  // Send a 500 Internal Server Error response
//   }
//   // console.error(err.stack); // Log the error details
// });

app.listen(7777, () => {
  console.log("Server is listening on port 7777.");
});
