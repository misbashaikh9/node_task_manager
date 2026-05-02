const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use("/api/tasks", require("./routes/taskRoutes"));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname + "/public" });
});

module.exports = app;
