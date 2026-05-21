const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const secretKey = process.env.SECRETKEY;

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Unauthorized! Please Login to access this resource.");
    }

    const decryptToken = await jwt.verify(token, secretKey);

    const userId = decryptToken._id;
    if (!userId) {
      throw new Error("Unauthorized! Please Login to access this resource.");
    }

    const userProfile = await User.findById(userId);
    req.user = userProfile;
    next();
  } catch (error) {
    res.status(401).send("Error: " + error.message);
  }
};

module.exports = {
  userAuth,
};
