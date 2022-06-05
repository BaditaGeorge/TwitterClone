const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
    postID: String,
    userID: String,
});

module.exports = mongoose.model("like", LikeSchema, "Likes");