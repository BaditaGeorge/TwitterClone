const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    value: String,
    old: String,
    userID: String,
});

module.exports = mongoose.model('token', TokenSchema, 'Tokens');