const UserModel = require("../models/user");
const TokenModel = require("../models/token");
const JWT = require("../utils/jwtUtils");
const { processMongoError } = require("../utils/processErrors");

const createToken = (user, oldToken = undefined) => {
  return new Promise((resolve, reject) => {
    const jwtToken = JWT.generate(user["_id"]);
    TokenModel.create(
      {
        value: jwtToken,
        userID: user["_id"],
        old: oldToken ? oldToken : "",
      },
      (err, token) => {
        if (err) reject(processMongoError(err));
        resolve(jwtToken);
      }
    );
  });
};

const authService = {
  loginUser: function (loginData) {
    return new Promise((resolve, reject) => {
      UserModel.findOne(loginData, (err, user) => {
        if (err) {
          reject(processMongoError(err));
        }

        if (!user) {
          reject({
            status: 404,
            message: "User not found!",
          });
        }

        createToken(user)
          .then((tokenValue) => {
            const { _id, name, email, avatar, followees } = user;
            resolve({
              id: _id,
              name: name,
              email: email,
              token: tokenValue,
              avatar: avatar,
              followees: followees,
            });
          })
          .catch((err) => {
            return reject(processMongoError(err));
          });
      });
    });
  },
  logoutUser: function (userID, token) {
    return new Promise((resolve, reject) => {
      TokenModel.deleteOne({ userID: userID, value: token }, (err, data) => {
        if (err) {
          reject(processMongoError(err));
        } else {
          resolve();
        }
      });
    });
  },
  refreshAuthentication: function (userID, token) {
    return new Promise((resolve, reject) => {
      TokenModel.deleteOne({ userID: userID, value: token }, (err, data) => {
        if (err) {
          reject(processMongoError(err));
        }
        createToken({ _id: userID }, token)
          .then((newToken) => {
            resolve(newToken);
          })
          .catch((err) => reject(processMongoError(err)));
      });
    });
  },
  retrieveRefreshedToken: function (userID, oldToken) {
    return new Promise((resolve, reject) => {
      TokenModel.findOne({ userID: userID, old: oldToken }, (err, data) => {
        if (err) {
          reject(processMongoError(err));
        }

        if (!data) {
          reject({
            status: 404,
            message: "No entry associated with received data!",
          });
        } else {
          resolve(data["value"]);
        }
      });
    });
  },
};

module.exports = authService;
