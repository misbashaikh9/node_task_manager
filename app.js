const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use("/api/tasks", require("./routes/taskRoutes"));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname + "/public" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' ? 'Server error' : err.message
  });
});

module.exports = app;
