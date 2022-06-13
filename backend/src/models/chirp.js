const mongoose = require("mongoose");

const ChirpSchema = new mongoose.Schema({
    text: String,
    images: [String],
    video: String,
    ownerID: {
        type: String,
        ref: "Users",
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Likes",
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",
    }],
});

module.exports = mongoose.model('Chirps', ChirpSchema, 'Chirps');