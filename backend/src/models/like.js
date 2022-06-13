const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chirps",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
});

LikeSchema.index({ post: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Likes", LikeSchema, "Likes");