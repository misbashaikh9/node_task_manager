# Task Manager

A simple task management app built with **Node.js**, **Express**, **MongoDB**, and **Mongoose**. It includes a browser frontend plus a REST API for creating, editing, completing, and deleting tasks.

## Features

- Create tasks with title, description, due date, and category
- Edit tasks from the UI or API
- Mark tasks as completed and prevent repeated completion
- Delete tasks
- MongoDB storage with Mongoose validation
- Category support: `work`, `personal`, `shopping`, `health`, `education`, `other`
- Due-date validation to prevent past deadlines
- Automated tests with `mocha`, `chai`, `supertest`, and `mongodb-memory-server`

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB running locally or accessible via a connection string

### Install dependencies

```bash
cd d:\Misba\Project\node-task-manager
npm install
```

### Start the application

```bash
npm start
```

Open your browser at:

```text
http://localhost:5000
```

## API Endpoints

### Create a task

```http
POST /api/tasks
```

Request body example:

```json
{
  "title": "Submit report",
  "description": "Finish the monthly report",
  "dueDate": "2026-06-15",
  "category": "work"
}
```

### Get all tasks

```http
GET /api/tasks
```

### Update a task

```http
PUT /api/tasks/:id
```

Request body example:

```json
{
  "title": "Submit report",
  "description": "Update with new metrics",
  "dueDate": "2026-06-18",
  "category": "work",
  "completed": true
}
```

### Delete a task

```http
DELETE /api/tasks/:id
```

## Example curl commands

Create a task:

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Node.js","description":"Study Node.js basics","dueDate":"2026-06-01","category":"education"}'
```

Get all tasks:

```bash
curl http://localhost:5000/api/tasks
```

Update a task:

```bash
curl -X PUT http://localhost:5000/api/tasks/<task_id> \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

Delete a task:

```bash
curl -X DELETE http://localhost:5000/api/tasks/<task_id>
```

## Running tests

```bash
npm test
```

The test suite uses an in-memory MongoDB server, so it does not require a local database instance when running tests.

## Project Structure

```
node-task-manager/
├── app.js                   # Express application setup
├── config/
│   └── db.js                # MongoDB connection helper
├── controllers/
│   └── taskController.js    # Task business logic
├── models/
│   └── Task.js              # Mongoose schema for tasks
├── public/
│   ├── index.html           # Frontend UI
│   ├── styles.css           # Frontend styling
│   └── app.js               # Frontend JavaScript
├── routes/
│   └── taskRoutes.js        # API routes
├── server.js                # Application entrypoint
├── tests/
│   └── taskRoutes.test.js   # API tests
└── package.json             # Project metadata and scripts
```

## Notes

- The frontend is served from the `public/` folder.
- Valid task categories are: `work`, `personal`, `shopping`, `health`, `education`, and `other`.
- Due dates must be valid future dates.
- Start the app from the `node-task-manager` folder.

---

Built to be easy to run locally and extend with filtering, search, or authentication.
