const NotesFolder = require("../model/folderModel");
const Note = require("../model/noteModal");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getNotesFolder = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    NotesFolder.find({ userId: req.user._id }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const notesFolder = await features.query;

  res.status(201).json(notesFolder);

  next();
});

exports.createNotesFolder = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { name, notesId } = req.body;

  const notes = await Note.find({ _id: notesId });
  const newNotesFolder = await NotesFolder.create({
    userId: userId,
    name: name,
    notesId: notes,
  });

  if (!name) {
    return next();
  }
  newNotesFolder.save();

  res.status(201).json({ status: "notes folder created." });
  next();
});

exports.getNotesFromFolder = catchAsync(async (req, res, next) => {
  const notesFromFolder = await NotesFolder.findById(req.params.id);

  if (!notesFromFolder) {
    return next(new AppError("Folder not found!"));
  }

  const { notesId } = notesFromFolder;

  res.status(201).json(notesId);
  next();
});

exports.updateFolder = catchAsync(async (req, res, next) => {
  const folder = await NotesFolder.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
  });
  if (!folder) return next(new AppError("Folder doesnt exist"));

  res.status(201).json({ status: "updated" });
});

exports.deleteFolder = catchAsync(async (req, res, next) => {
  const folder = await NotesFolder.findByIdAndDelete(req.params.id);

  if (!folder) return next(new AppError("Folder doesnt exist"));

  res.status(201).json({ status: "deleted" });
});
