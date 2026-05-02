const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value >= new Date();
        },
        message: "Due date cannot be in the past",
      },
    },
    category: {
      type: String,
      enum: ["work", "personal", "shopping", "health", "education", "other"],
      default: "other",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);