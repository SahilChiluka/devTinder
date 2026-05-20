const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName : {
    type : String,
    required : true,
    minLength : 3,
    maxLength : 20
  },
  lastName : {
    type : String,
    minLength : 3,
    maxLength : 20
  },
  email : {
    type : String,
    required : true,
    unique : true,
    trim : true, // to remove the whitespace from the beginning and end of the string
    lowercase : true,
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error("Invalid Email Address!");
      }
    }
  },
  password : {
    type : String,
    required : true,
    validate(value) {
      if(!validator.isStrongPassword(value)) {
        throw new Error("Create a Strong Password.");
      }
    }
  },
  age : {
    type : Number,
    min : 18
  },
  gender : {
    type : String,
    validate(value) { // custom validator
      if(!["Male", "Female", "Other"].includes(value)) {
        throw new Error("Gender must be Male, Female or Other");
      }
    }
  },
  photoUrl : {
    type : String,
    default : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    validate(value) {
      if(!validator.isURL(value)) {
        throw new Error("Invalid Image URL");
      }
    }
  },
  about : {
    type : String,
    default : "Hey there! I am using DevTinder.",
    maxLength : 500
  },
  skills : {
    type : [String]
  }
}, {
  timestamps : true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
