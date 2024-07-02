const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: {
    type: String,
    reqruied: [true, "This field is required"],
  },
  title: {
    type: String,
    required: [true, "This field is required!"],
  },
  dueDate: {
    type: Date,
    required: [true, "This field is required!"],
  },
  priority: {
    type: String,
    default: "low",
    required: true,
  },
  status: {
    type: String,
    default: "todo",
    required: true,
  },
  overdue: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
