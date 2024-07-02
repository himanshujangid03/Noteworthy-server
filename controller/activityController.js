const ActivityLog = require("../model/activityModel");
const catchAsync = require("../utils/catchAsync");

exports.createActivityLog = catchAsync(async (req, res, next) => {
  const activityLog = await ActivityLog.create({
    userId: req.user._id,
    name: req.body.name,
    emoji: req.body.emoji,
    action: req.body.action,
    updatedAt: req.body.updatedAt,
  });

  res
    .status(200)
    .json({ status: "success", message: "Activity log created Successfully." });

  next();
});

exports.getActivityLog = catchAsync(async (req, res, next) => {
  const activityLog = await ActivityLog.find({ userId: req.user._id });

  res.status(200).json(activityLog);
  next();
});
