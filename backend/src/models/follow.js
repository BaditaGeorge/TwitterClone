const mongoose = require("mongoose");

const FollowSchema = new mongoose.Schema({
    follower: String,
    followee: String,
});

FollowSchema.index({ follower: 1, followee: 1 }, { unique: true });

module.exports = mongoose.model("Follows", FollowSchema, "Follows");