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

app.get("/user/getUserData", userAuth, (req, res) => {
  res.send("Send User Data");
})

app.listen(7777, () => {
  console.log("Server is listening on port 7777.");
});
