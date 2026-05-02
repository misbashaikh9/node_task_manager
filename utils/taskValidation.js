const categories = ["work", "personal", "shopping", "health", "education", "other"];

const validateTitle = (title) => {
  if (!title) {
    return "Title cannot be empty";
  }
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    return "Title cannot be just whitespace";
  }
  if (trimmedTitle.length > 100) {
    return "Title cannot exceed 100 characters";
  }
  return null;
};

const validateDescription = (description) => {
  if (description && description.length > 500) {
    return "Description cannot exceed 500 characters";
  }
  return null;
};

const validateDueDate = (dueDate) => {
  if (dueDate === undefined || dueDate === null || dueDate === "") {
    return null;
  }

  const parsed = new Date(dueDate);
  if (Number.isNaN(parsed.getTime())) {
    return "Due date must be a valid date";
  }

  if (parsed < new Date()) {
    return "Due date cannot be in the past";
  }

  return null;
};

const validateCategory = (category) => {
  if (category === undefined || category === null || category === "") {
    return null;
  }
  if (!categories.includes(category)) {
    return `Category must be one of: ${categories.join(", ")}`;
  }
  return null;
};

const validateCompleted = (completed) => {
  if (completed !== undefined && typeof completed !== 'boolean') {
    return "Completed must be a boolean value (true or false)";
  }
  return null;
};

const validateTaskId = (id) => {
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return "Invalid task ID format";
  }
  return null;
};

module.exports = {
  categories,
  validateTitle,
  validateDescription,
  validateDueDate,
  validateCategory,
  validateCompleted,
  validateTaskId,
};