const NotificationModel = require("../models/notification");
const UserModel = require("../models/user");
const FollowModel = require("../models/follow");
const SocketStore = require("../utils/socketStore");
const { processMongoError } = require("../utils/processErrors");
const NotificationType = require("../types/notification");

const notificationBuilder = (
  notificationType,
  targetUserID = undefined,
  actorUserID = undefined,
  actorUserEmail = undefined
) => {
  let content = undefined;
  if (actorUserID) {
    if (notificationType === NotificationType.FOLLOW) {
      content = `${actorUserEmail} start following you!`;
    } else if (notificationType === NotificationType.LIKE) {
      content = `${actorUserEmail} liked one of your posts!`;
    } else if (notificationType === NotificationType.MESSAGE) {
      content = `${actorUserEmail} left a comment to one of your posts!`;
    } else if (notificationType === NotificationType.POST) {
      content = `${actorUserEmail} posted something new! Check it out!`;
    }
  }

  return {
    type: notificationType,
    content: content,
    actorUserID: actorUserID,
    targetUserID: targetUserID,
    actorUserAvatar: "http://localhost:5050/batman.jpg",
    actorUserEmail: actorUserEmail,
    viewed: false,
  };
};

const NotificationService = {
  createNotification: (
    actorUserID,
    targetUserID = undefined,
    notificationType
  ) => {
    if(targetUserID) {
      if(actorUserID.toString() === targetUserID.toString()) {
        return;
      }
    }
    UserModel.findOne({ _id: actorUserID }, (err, userData) => {
      console.log(actorUserID, targetUserID, notificationType);
      const notificationObject = notificationBuilder(
        notificationType,
        targetUserID,
        actorUserID,
        userData.email
      );
      if (targetUserID) {
        NotificationModel.create(
          notificationObject,
          (err, notificationData) => {
            SocketStore.emitFor(targetUserID, "notify", notificationData);
          }
        );
      } else {
        FollowModel.find({ followee: actorUserID }, (err, followers) => {
          followers.forEach((entity) => {
            NotificationModel.create(
              { ...notificationObject, targetUserID: entity.follower },
              (err, notificationData) => {
                SocketStore.emitFor(
                  entity.follower,
                  "notify",
                  notificationData
                );
              }
            );
          });
        });
      }
    });
  },
  retrieveNotifications: (ownerID) => {
    return new Promise((resolve, reject) => {
      NotificationModel.find(
        { targetUserID: ownerID },
        (err, notifications) => {
          if (err) reject(processMongoError(err));
          else resolve(notifications);
        }
      );
    });
  },
  updateNotifications: (ownerID, notificationsID) => {},
};

module.exports = NotificationService;
