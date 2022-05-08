const jwt = require("jsonwebtoken");
const config = require("../config");

const jwtKey = "my_secreet_key";
const jwtExpirySeconds = config.jwtExpiryTimeSeconds;

const JWT = {
  generate: function (userID) {
    const token = jwt.sign({ userID }, jwtKey, {
      algorithm: "HS256",
      expiresIn: jwtExpirySeconds,
    });
    return token;
  },
  verify: function (token) {
    return jwt.verify(token, jwtKey);
  },
  checkIfTokenExpired: function (token) {
    try {
      const payload = this.verify(token);
      return payload.exp - Date.now() / 1000 <= 10;
    } catch (error) {
      return null;
    }
  },
};

module.exports = JWT;
