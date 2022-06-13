const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chirps",
    },
    text: String,
    userAvatar: String,
    userName: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
});

module.exports = mongoose.model("Comments", CommentSchema, "Comments");