const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
    unique: true,
  },
  password: String,
  avatar: String,
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Likes",
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comments",
  }],
  followees: [String],
});

module.exports = mongoose.model("Users", UserSchema, "Users");
