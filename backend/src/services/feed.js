const { processMongoError } = require("../utils/processErrors");
const ChirpModel = require("../models/chirp");
const LikeModel = require("../models/like");
const CommentModel = require("../models/comment");
const UserModel = require("../models/user");
const FollowModel = require("../models/follow");
const NotificationService = require("./notification");
const NotificationType = require("../types/notification");
const mongoose = require("mongoose");

const feedService = {
  createChirp: function (chirpData) {
    return new Promise((resolve, reject) => {
      ChirpModel.create(chirpData, (err, data) => {
        if (err) reject(processMongoError(err));
        NotificationService.createNotification(
          chirpData.ownerID,
          (targetUserID = undefined),
          NotificationType.POST
        );
        resolve(data);
      });
    });
  },
  retrieveChirps: function (userID, page) {
    return new Promise((resolve, reject) => {
      ChirpModel.find({}, (err, data) => {
        if (err) reject(processMongoError(err));
        const objectData = data.map((chirp) => chirp.toObject());
        resolve(
          objectData.map((chirp) => {
            return {
              ...chirp,
              isLiked: chirp.likes
                .map((like) => like.user.toString())
                .includes(userID.toString()),
            };
          })
        );
      })
        .limit(5)
        .skip(page * 5)
        .sort({ _id: -1 })
        .populate("likes")
        .populate("comments")
        .populate("ownerID");
    });
  },
  likeChirp: function (postID, userID) {
    return new Promise((resolve, reject) => {
      LikeModel.create(
        {
          post: mongoose.Types.ObjectId(postID),
          user: userID,
        },
        (err, likeData) => {
          if (err) reject(processMongoError(err));
          else {
            ChirpModel.findOneAndUpdate(
              { _id: postID },
              { $push: { likes: likeData._id } },
              { new: true },
              (err, chirpData) => {
                if (err) reject(processMongoError(err));
                UserModel.findOneAndUpdate(
                  { _id: userID },
                  { $push: { likes: likeData._id } },
                  { new: true },
                  (err, data) => {
                    if (err) reject(processMongoError(err));
                    NotificationService.createNotification(
                      userID,
                      chirpData.ownerID._id,
                      NotificationType.LIKE
                    );
                    resolve(likeData);
                  }
                );
              }
            ).populate("ownerID");
          }
        }
      );
    });
  },
  removeLike: function (postID, userID) {
    return new Promise((resolve, reject) => {
      LikeModel.findOneAndDelete(
        { post: postID, user: userID },
        (err, likeData) => {
          if (err) reject(processMongoError(err));
          else {
            ChirpModel.findOneAndUpdate(
              { _id: postID },
              { $pull: { likes: likeData._id } },
              (err, data) => {
                if (err) reject(processMongoError(err));
                UserModel.findOneAndUpdate(
                  { _id: userID },
                  { $pull: { likes: likeData._id } },
                  (err, data) => {
                    if (err) reject(processMongoError(err));
                    resolve(likeData);
                  }
                );
              }
            );
          }
        }
      );
    });
  },
  commentChirp: function (postID, userID, text, userName, userAvatar) {
    return new Promise((resolve, reject) => {
      CommentModel.create(
        {
          post: mongoose.Types.ObjectId(postID),
          user: mongoose.Types.ObjectId(userID),
          text: text,
          userName: userName,
          userAvatar: userAvatar,
        },
        (err, commData) => {
          if (err) reject(processMongoError(err));
          else {
            ChirpModel.findOneAndUpdate(
              { _id: postID },
              { $push: { comments: commData._id } },
              { new: true },
              (err, chirpData) => {
                if (err) reject(processMongoError(err));
                UserModel.findOneAndUpdate(
                  { _id: userID },
                  { $push: { comments: commData._id } },
                  { new: true },
                  (err, data) => {
                    if (err) reject(processMongoError(err));
                    else {
                      NotificationService.createNotification(
                        userID,
                        chirpData.ownerID._id,
                        NotificationType.MESSAGE
                      );
                      resolve(commData);
                    }
                  }
                );
              }
            ).populate("ownerID");
          }
        }
      );
    });
  },
  createFollow: function (followerID, followeeID) {
    return new Promise((resolve, reject) => {
      FollowModel.create(
        {
          follower: followerID,
          followee: followeeID,
        },
        (err, followData) => {
          if (err) reject(processMongoError(err));
          else {
            UserModel.findOneAndUpdate(
              { _id: followerID },
              { $push: { followees: followeeID } },
              { new: true },
              (err, data) => {
                if (err) reject(processMongoError(err));
                else {
                  NotificationService.createNotification(
                    followerID,
                    followeeID,
                    NotificationType.FOLLOW
                  );
                  resolve(followData);
                }
              }
            );
          }
        }
      );
    });
  },
  removeFollow: function (followerID, followeeID) {
    return new Promise((resolve, reject) => {
      FollowModel.deleteOne(
        { follower: followerID, followee: followeeID },
        (err, followData) => {
          if (err) reject(processMongoError(err));
          else {
            UserModel.findOneAndUpdate(
              { _id: followerID },
              { $pull: { followees: followeeID } },
              (err, data) => {
                if (err) reject(processMongoError(err));
                else resolve(followData);
              }
            );
          }
        }
      );
    });
  },
  removeChirp: function (chirpID) {
    return new Promise((resolve, reject) => {
      ChirpModel.deleteOne({ _id: chirpID }, (err) => {
        if (err) reject(processMongoError);
        else resolve({});
      });
    });
  },
  updateChirp: function (chirpID, values) {
    return new Promise((resolve, reject) => {
      ChirpModel.findOneAndUpdate(
        { _id: chirpID },
        values,
        { new: true },
        (err, data) => {
          if (err) reject(processMongoError(err));
          else resolve(data);
        }
      );
    });
  },
};

module.exports = feedService;
