const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

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

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials!");
    } else {
      res.send("Login Successfull!");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.get("/userByEmail", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      res.status(404).send("User Not Found!");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Something Went Wrong! " + error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length == 0) {
      res.status(404).send("Users not found!");
    }
    res.send(users);
  } catch (error) {
    res.status(400).send("Something Went Wrong! " + error.message);
  }
});

app.delete("/deleteUser", async (req, res) => {
  // const userId = req.body.userId;
  const firstName = req.body.firstName;

  try {
    const deletedUser = await User.findOneAndDelete({ firstName: firstName });
    res.send("Deleted User Successfully!");
  } catch (error) {
    res.status(400).send("Something Went Wrong! " + error.message);
  }
});

app.patch("/updateUser", async (req, res) => {
  const userId = req.body.userId;
  const updateData = req.body;

  try {
    const allowedUpdates = [
      "firstName",
      "lastName",
      "photoUrl",
      "about",
      "skills",
      "age",
      "gender",
    ];
    const isUpdateAllowed = Object.keys(updateData).every((key) =>
      allowedUpdates.includes(key),
    );

    if (!isUpdateAllowed) {
      throw new Error(
        "Invalid Updates! You can only update firstName, lastName, photos, about, skills, age and gender.",
      );
    }
    if (
      updateData.skills &&
      !Array.isArray(updateData.skills) &&
      updateData.skills.length > 10
    ) {
      throw new Error("You can add maximum 10 skills!");
    }
    const updateUser = await User.findOneAndUpdate(
      { _id: userId },
      updateData,
      {
        runValidators: true, // to run the validators defined in the schema while updating
      },
    );
    res.send("User Updated Successfully!");
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
