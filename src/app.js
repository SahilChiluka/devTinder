const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {

  const user = new User({
    firstName: "Sahil",
    lastName: "Chiluka",
    email: "sahil@gmail.com",
    password: "sahil",
    age: 23,
    gender: "Male"
  });

  try {
    await user.save();
    res.send("User Saved Successfully!");
  } catch (error) {
    res.send("Error Saving The User into Database: " + error.message);
  }
});

connectDB().then(() => {
  console.log("Database Connected Successfully!");
  app.listen(7777, () => {
    console.log("Server is listening on port 7777.");
  });
}).catch((err) => {
  console.log("Database Connection Failed ", err.message);
});
