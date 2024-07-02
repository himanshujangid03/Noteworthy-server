const mongoose = require("mongoose");

const notesFolderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User Id is required"],
    trim: true,
  },
  name: {
    type: String,
    required: [true, "The folder name is required."],
  },
  notesId: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const NotesFolder = mongoose.model("NotesFolder", notesFolderSchema);

module.exports = NotesFolder;
