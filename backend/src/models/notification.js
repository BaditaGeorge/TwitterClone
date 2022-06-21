const mongoose = require("mongoose");

const NotificationModel = new mongoose.Schema({
  type: String,
  content: String,
  targetUserID: String,
  actorUserID: String,
  actorUserAvatar: String,
  actorUserEmail: String,
  viewed: Boolean,
});

module.exports = mongoose.model(
  "Notifications",
  NotificationModel,
  "Notifications"
);
