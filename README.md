# Task Manager API

A simple REST API for managing tasks built with Node.js, Express, and MongoDB.

## Features

-  Create tasks with title and description
-  View all tasks
-  Mark tasks as completed
-  Edit task details
-  Delete tasks
-  Data stored in MongoDB database
-  Basic validation (title required, prevent re-completing tasks)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running on your system

3. Start the server:
```bash
npm start
```

4. Open your browser to:
```text
http://localhost:5000
```

The server will run on `http://localhost:5000`

## API Endpoints

### Create a Task
```http
POST /api/tasks
```

**Request Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the task manager project"
}
```

### Get All Tasks
```http
GET /api/tasks
```

### Update a Task
```http
PUT /api/tasks/:id
```

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

### Delete a Task
```http
DELETE /api/tasks/:id
```

## Usage Examples

You can test the API using:
- **Postman** or **Insomnia** for GUI testing
- **curl** commands in terminal
- Any HTTP client

### Example curl commands:

**Create a task:**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Node.js", "description": "Study Node.js basics"}'
```

**Get all tasks:**
```bash
curl http://localhost:5000/api/tasks
```

**Update a task:**
```bash
curl -X PUT http://localhost:5000/api/tasks/{task_id} \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

## Project Structure

```
node-task-manager/
├── config/
│   └── db.js              # Database connection
├── controllers/
│   └── taskController.js  # Task operations
├── middleware/
│   └── errorMiddleware.js # Error handling
├── models/
│   └── Task.js           # Task data model
├── routes/
│   └── taskRoutes.js     # API routes
├── server.js             # Main server file
└── package.json          # Dependencies
```