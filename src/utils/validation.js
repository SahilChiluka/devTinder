const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Invalid firstName or lastName.");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid Email Address!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a Strong Password.");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = ["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"];

  const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));

  return isEditAllowed;
};

const validateConnectionRequestData = (req) => {
  const fromUserId = req.user._id;
  const toUserId = req.params.userId;
  const status = req.params.status;

  const allowedStatus = ["interested", "ignored"];

  // if(fromUserId == toUserId) {
  //   throw new Error("Cannot sent the connection request to yourself");
  // }
  if(!allowedStatus.includes(status)) {
    throw new Error("Invaild Status Type");
  }
}

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateConnectionRequestData
};
