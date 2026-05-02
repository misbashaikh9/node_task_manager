const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const { expect } = require("chai");

const app = require("../app");
const Task = require("../models/Task");

describe("Task API", function () {
  let mongoServer;

  before(async function () {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  after(async function () {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async function () {
    await Task.deleteMany({});
  });

  it("creates a task with due date and category", async function () {
    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const response = await request(app)
      .post("/api/tasks")
      .send({
        title: "Write tests",
        description: "Add due date and category support",
        dueDate,
        category: "work",
      });

    expect(response.status).to.equal(201);
    expect(response.body).to.include({
      title: "Write tests",
      description: "Add due date and category support",
      category: "work",
      completed: false,
    });
    expect(response.body.dueDate).to.exist;
  });

  it("rejects a task with an empty title", async function () {
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: "", description: "No title" });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.match(/Title cannot be empty/);
  });

  it("rejects a task with a past due date", async function () {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: "Past due", dueDate: pastDate });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.match(/Due date cannot be in the past/);
  });

  it("updates a task's category, due date, and completion status", async function () {
    const task = await Task.create({
      title: "Plan launch",
      dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
      category: "other",
    });

    const newDueDate = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const response = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({
        category: "personal",
        dueDate: newDueDate,
        completed: true,
      });

    expect(response.status).to.equal(200);
    expect(response.body.category).to.equal("personal");
    expect(new Date(response.body.dueDate).toISOString().slice(0, 10)).to.equal(newDueDate);
    expect(response.body.completed).to.equal(true);
  });

  it("prevents re-completing an already completed task", async function () {
    const task = await Task.create({ title: "Done task", completed: true });

    const response = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({ completed: true });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.match(/already completed/);
  });

  it("deletes a task successfully", async function () {
    const task = await Task.create({ title: "Remove me" });

    const response = await request(app).delete(`/api/tasks/${task.id}`);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Task deleted successfully");

    const found = await Task.findById(task.id);
    expect(found).to.be.null;
  });
});
