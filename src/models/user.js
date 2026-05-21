const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, // to remove the whitespace from the beginning and end of the string
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        // custom validator
        if (!["Male", "Female", "Other"].includes(value)) {
          throw new Error("Gender must be Male, Female or Other");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Image URL");
        }
      },
    },
    about: {
      type: String,
      default: "Hey there! I am using DevTinder.",
      maxLength: 500,
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJwt = async function () {
  const user = this;
  const secretKey = process.env.SECRETKEY;

  const token = await jwt.sign({ _id: user._id }, secretKey, {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.verifyPassword = async function (passwordInputbyUser) {
  const user = this;

  const isPasswordValid = await bcrypt.compare(
    passwordInputbyUser,
    user.password,
  );

  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
