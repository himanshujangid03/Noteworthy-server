/* eslint-disable no-unused-vars */
const NotesFolder = require("../model/folderModel");
const Note = require("../model/noteModal");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getRecentNotes = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-createdAt";
  req.query.fields = "name,createdAt";
  next();
};

exports.createNote = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { title, content, folderId, emoji } = req.body;

  const newNote = await Note.create({
    userId: userId,
    folderId: folderId,
    title: title,
    content: content,
    emoji: emoji,
  });

  if (!title || !content) {
    return next();
  }
  newNote.save();

  res.status(201).json({ status: "success" });
  next();
});

exports.getAllNotes = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const notes = await Note.find({ userId: userId });

  if (!notes) return next(new AppError("Notes not found"), 404);

  res.status(201).json(notes);
  next();
});

exports.getNote = catchAsync(async (req, res, next) => {
  const folderId = req.params.id;
  const note = await Note.find({ folderId: folderId });

  res.status(201).json(note);
  next();
});

exports.updateNote = catchAsync(async (req, res, next) => {
  const note = await Note.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    content: req.body.content,
    emoji: req.body.emoji,
  });
  res.status(201).json({ status: "updated" });
  next();
});

exports.deleteNote = catchAsync(async (req, res, next) => {
  const note = await Note.findByIdAndDelete(req.params.id);

  if (!note) {
    return next(new AppError("Note does not exist!", 404));
  }

  res.status(201).json({ status: "deleted" });

  next();
});
