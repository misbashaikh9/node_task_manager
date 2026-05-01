const Task = require("../models/Task");

// CREATE TASK
exports.createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }

    const task = await Task.create({ title, description });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// GET ALL TASKS
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// UPDATE TASK
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // prevent re-completing
    if (task.completed && req.body.completed === true) {
      return res.status(400).json({ message: "Task already completed" });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.completed =
      req.body.completed !== undefined ? req.body.completed : task.completed;

    const updated = await task.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE TASK
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};