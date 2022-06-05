const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    postID: String,
    userID: String,
    text: String,
});

module.exports = mongoose.model("comment", CommentSchema, "Comments");