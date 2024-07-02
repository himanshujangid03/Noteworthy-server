const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId: String,
  name: String,
  emoji: String,
  action: String,
  updatedAt: Date,
});

const ActivityLog = mongoose.model("ActivityLog", activitySchema);

module.exports = ActivityLog;
