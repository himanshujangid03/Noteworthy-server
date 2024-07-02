/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User Id is required!"],
    trim: true,
  },
  folderId: {
    type: String,
  },
  title: {
    type: String,
    required: [true, "Please define note title"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Please define not content"],
    trim: true,
  },
  emoji: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
