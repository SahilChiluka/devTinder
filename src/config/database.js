const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://admin-sahil:2T8bdJtRyrqk9d2h@cluster0.d89byi4.mongodb.net/devTinder");
}

module.exports = connectDB;
