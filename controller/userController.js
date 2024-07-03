const User = require("../model/userModel");
const Note = require("../model/noteModal");
const Folder = require("../model/folderModel");
const Task = require("../model/taskModel");
const catchAsync = require("../utils/catchAsync");

exports.updateUser = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const newUser = await User.findOneAndUpdate(userId, {
    name: req.body.name,
  });
  newUser.save();

  res.status(201).json({ status: "name changed successfully." });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  await Note.deleteMany({ userId: userId });
  await Folder.deleteMany({ userId: userId });
  await Task.deleteMany({ userId: userId });
  await User.findByIdAndDelete(userId);

  res.redirect("https://noteworthy-app.vercel.app/");
  next();
});
