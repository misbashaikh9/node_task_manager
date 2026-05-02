const apiBase = '/api/tasks';
const taskListEl = document.getElementById('taskList');
const createForm = document.getElementById('createTaskForm');
const titleInput = document.getElementById('taskTitle');
const descriptionInput = document.getElementById('taskDescription');
const dueDateInput = document.getElementById('taskDueDate');
const categoryInput = document.getElementById('taskCategory');
const messageEl = document.getElementById('message');
const refreshButton = document.getElementById('refreshButton');
const taskCountEl = document.getElementById('taskCount');
const editSection = document.getElementById('editTaskSection');
const editForm = document.getElementById('editTaskForm');
const editTitleInput = document.getElementById('editTaskTitle');
const editDescriptionInput = document.getElementById('editTaskDescription');
const editDueDateInput = document.getElementById('editTaskDueDate');
const editCategoryInput = document.getElementById('editTaskCategory');
const closeEditButton = document.getElementById('closeEditButton');
let editingTaskId = null;
let tasksCache = [];

const showMessage = (text, isError = true) => {
  messageEl.textContent = text;
  messageEl.style.color = isError ? '#ef4444' : '#047857';
  if (!text) return;
  setTimeout(() => {
    messageEl.textContent = '';
  }, 3800);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
};

const setTaskCount = (count) => {
  taskCountEl.textContent = `${count} ${count === 1 ? 'task' : 'tasks'} found`;
};

const openEditForm = (task) => {
  editingTaskId = task._id;
  editTitleInput.value = task.title;
  editDescriptionInput.value = task.description || '';
  editDueDateInput.value = task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '';
  editCategoryInput.value = task.category || 'other';
  editSection.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const closeEditForm = () => {
  editingTaskId = null;
  editForm.reset();
  editSection.classList.add('hidden');
};

const loadTasks = async () => {
  try {
    taskListEl.innerHTML = '<div class="task-card"><p>Loading tasks...</p></div>';
    const response = await fetch(apiBase);
    if (!response.ok) {
      throw new Error('Unable to load tasks');
    }
    const tasks = await response.json();

    if (!tasks.length) {
      taskListEl.innerHTML = '<div class="task-card"><p>No tasks yet. Add one to get started.</p></div>';
      setTaskCount(0);
      return;
    }

    taskListEl.innerHTML = '';
    setTaskCount(tasks.length);
    tasksCache = tasks;

    tasks.forEach((task) => {
      const taskCard = document.createElement('div');
      taskCard.className = `task-card ${task.completed ? 'completed' : ''}`;

      const completedBadge = task.completed
        ? '<span class="badge completed">Completed</span>'
        : '<span class="badge pending">Pending</span>';

      const description = task.description ? task.description : '<em>No description</em>';

      taskCard.innerHTML = `
        <div class="card-header">
          <div>
            <h3>${task.title}</h3>
          </div>
          ${completedBadge}
        </div>
        <p>${description}</p>
        <div class="meta">
          <span>Created: ${formatDate(task.createdAt)}</span>
          <span>Category: ${task.category || 'other'}</span>
          ${task.dueDate ? `<span>Due: ${formatDate(task.dueDate)}</span>` : ''}
        </div>
        <div class="actions">
          ${!task.completed ? `<button class="secondary" data-action="complete" data-id="${task._id}">Mark Complete</button>` : ''}
          <button class="secondary" data-action="edit" data-id="${task._id}">Edit</button>
          <button data-action="delete" data-id="${task._id}">Delete</button>
        </div>
      `;

      taskListEl.appendChild(taskCard);
    });
  } catch (error) {
    taskListEl.innerHTML = '<div class="task-card"><p>Unable to load tasks.</p></div>';
    showMessage(error.message || 'Failed to load tasks');
  }
};

const createTask = async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title) {
    showMessage('Title cannot be empty');
    return;
  }

  try {
    const response = await fetch(apiBase, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        dueDate: dueDateInput.value || undefined,
        category: categoryInput.value || 'other',
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      showMessage(data.message || 'Unable to create task');
      return;
    }

    createForm.reset();
    showMessage('Task created successfully', false);
    loadTasks();
  } catch (error) {
    showMessage(error.message || 'Unable to create task');
  }
};

const updateTask = async (id, updates) => {
  try {
    const response = await fetch(`${apiBase}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    if (!response.ok) {
      showMessage(data.message || 'Unable to update task');
      return;
    }

    showMessage('Task updated successfully', false);
    closeEditForm();
    loadTasks();
  } catch (error) {
    showMessage(error.message || 'Unable to update task');
  }
};

const deleteTask = async (id) => {
  if (!confirm('Delete this task?')) {
    return;
  }

  try {
    const response = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) {
      showMessage(data.message || 'Unable to delete task');
      return;
    }

    showMessage('Task deleted successfully', false);
    loadTasks();
  } catch (error) {
    showMessage(error.message || 'Unable to delete task');
  }
};

const handleTaskAction = (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;
  if (!action || !id) return;

  if (action === 'complete') {
    updateTask(id, { completed: true });
    return;
  }

  if (action === 'delete') {
    deleteTask(id);
    return;
  }

  if (action === 'edit') {
    const task = tasksCache.find((item) => item._id === id);
    if (!task) {
      showMessage('Unable to load task for editing');
      return;
    }
    openEditForm(task);
  }
};

createForm.addEventListener('submit', createTask);
refreshButton.addEventListener('click', loadTasks);
closeEditButton.addEventListener('click', closeEditForm);
editForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = editTitleInput.value.trim();
  const description = editDescriptionInput.value.trim();

  if (!title) {
    showMessage('Title cannot be empty');
    return;
  }

  updateTask(editingTaskId, {
    title,
    description,
    dueDate: editDueDateInput.value || undefined,
    category: editCategoryInput.value || 'other',
  });
});
taskListEl.addEventListener('click', handleTaskAction);

window.addEventListener('load', loadTasks);
