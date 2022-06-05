const { processMongoError } = require("../utils/processErrors");
const ChirpModel = require("../models/chirp");

const feedService = {
  createChirp: function (chirpData) {
    return new Promise((resolve, reject) => {
      ChirpModel.create(chirpData, (err, data) => {
        if (err) reject(processMongoError(err));
        resolve(data);
      });
    });
  },
  retrieveChirps: function (userID, page) {
    return new Promise((resolve, reject) => {
      ChirpModel.find({ ownerID: userID }, (err, data) => {
        if (err) reject(processMongoError(err));
        resolve(data);
      }).limit(5).skip(page * 5);
    });
  },
};

module.exports = feedService;
