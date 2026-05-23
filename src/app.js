const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database Connected Successfully!");
    app.listen(7777, () => {
      console.log("Server is listening on port 7777.");
    });
  })
  .catch((err) => {
    console.log("Database Connection Failed ", err.message);
  });
