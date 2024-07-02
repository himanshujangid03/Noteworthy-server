const Task = require("../model/taskModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createTask = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const newTask = await Task.create({
    userId: userId,
    title: req.body.title,
    dueDate: req.body.dueDate,
    priority: req.body.priority,
  });
  newTask.save();

  res.status(201).json({ status: "task created" });
  next();
});

exports.getTask = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const tasks = await Task.find({ userId: userId });

  const overdueTask = tasks.filter(
    (task) =>
      new Date(task.dueDate) < new Date() && task.status !== "completed",
  );

  await Promise.all(
    overdueTask.map((el) =>
      Task.findOneAndUpdate({ _id: el._id }, { overdue: true }),
    ),
  );

  res.status(201).json(tasks);
  next();
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndUpdate(req.params.id, {
    status: req.body.status,
    overdue: req.body.overdue,
  });

  res.status(201).json({ status: "updated task successfully." });
  next();
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task)
    return next(new AppError("Task can't be deleted. It doesn't exist."));

  res.status(201).json({ status: "success" });
  next();
});
