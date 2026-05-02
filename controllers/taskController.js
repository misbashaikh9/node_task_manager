const Task = require("../models/Task");
const {
  validateTitle,
  validateDescription,
  validateDueDate,
  validateCategory,
  validateCompleted,
  validateTaskId,
} = require("../utils/taskValidation");

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, category, completed } = req.body;

    const titleError = validateTitle(title);
    if (titleError) {
      return res.status(400).json({ message: titleError });
    }

    const descError = validateDescription(description);
    if (descError) {
      return res.status(400).json({ message: descError });
    }

    const dueDateError = validateDueDate(dueDate);
    if (dueDateError) {
      return res.status(400).json({ message: dueDateError });
    }

    const categoryError = validateCategory(category);
    if (categoryError) {
      return res.status(400).json({ message: categoryError });
    }

    const completedError = validateCompleted(completed);
    if (completedError) {
      return res.status(400).json({ message: completedError });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      category: category || "other",
      completed: completed || false,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL TASKS
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, category, completed } = req.body;

    // Validate task ID
    const idError = validateTaskId(id);
    if (idError) {
      return res.status(400).json({ message: idError });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Validate title if provided
    if (title !== undefined) {
      const titleError = validateTitle(title);
      if (titleError) {
        return res.status(400).json({ message: titleError });
      }
    }

    // Validate description if provided
    if (description !== undefined) {
      const descError = validateDescription(description);
      if (descError) {
        return res.status(400).json({ message: descError });
      }
    }

    // Validate due date if provided
    if (dueDate !== undefined) {
      const dueDateError = validateDueDate(dueDate);
      if (dueDateError) {
        return res.status(400).json({ message: dueDateError });
      }
    }

    // Validate category if provided
    if (category !== undefined) {
      const categoryError = validateCategory(category);
      if (categoryError) {
        return res.status(400).json({ message: categoryError });
      }
    }

    // Validate completed field if provided
    if (completed !== undefined) {
      const completedError = validateCompleted(completed);
      if (completedError) {
        return res.status(400).json({ message: completedError });
      }
    }

    // Prevent re-completing an already completed task
    if (task.completed && completed === true) {
      return res.status(400).json({ message: "Task is already completed" });
    }

    // Update fields
    if (title !== undefined) {
      task.title = title.trim();
    }
    if (description !== undefined) {
      task.description = description ? description.trim() : undefined;
    }
    if (dueDate !== undefined) {
      task.dueDate = dueDate ? new Date(dueDate) : undefined;
    }
    if (category !== undefined) {
      task.category = category || "other";
    }
    if (completed !== undefined) {
      task.completed = completed;
    }

    const updated = await task.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate task ID
    const idError = validateTaskId(id);
    if (idError) {
      return res.status(400).json({ message: idError });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};