const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

const secretKey = process.env.SECRETKEY;

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.send("User Saved Successfully!");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials!");
    }

    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials!");
    } else {
      const token = await user.getJwt();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set cookie to expire in 7 days
      });
      res.send("Login Successfull!");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  const userProfile = req.user;
  try {
    res.send(userProfile);
  } catch (error) {
    res.status(400).send("Something Went Wrong! " + error.message);
  }
});

app.post("/sentConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(
      user.firstName + " " + user.lastName + " sent a connection request!",
    );
  } catch (error) {
    res.status(400).send("Something Went Wrong! " + error.message);
  }
});

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
