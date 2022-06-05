const mongoose = require("mongoose");

const ChirpSchema = new mongoose.Schema({
    text: String,
    images: [String],
    video: String,
    ownerID: String,
});

module.exports = mongoose.model('chirp', ChirpSchema, 'Chirps');