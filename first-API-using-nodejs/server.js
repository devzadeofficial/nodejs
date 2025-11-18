const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Path to JSON file
const DATA_FILE = path.join(__dirname, "tasks.json");

// Helper: Read tasks from file
function loadTasks() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

// Helper: Save tasks to file
function saveTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// -----------------------------
// GET /  -> health check
// -----------------------------
app.get("/", (req, res) => {
  res.send("server is alive and running");
});

// -----------------------------
// GET /tasks  -> return all tasks
// -----------------------------
app.get("/tasks", (req, res) => {
  try {
    const tasks = loadTasks();
    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error reading tasks" });
  }
});

// -----------------------------
// POST /tasks  -> add a new task
// Body: { "title": "Task name" }
// -----------------------------
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });
  }

  try {
    const tasks = loadTasks();

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      completed: false,
    };

    tasks.push(newTask);
    saveTasks(tasks);

    res.status(201).json({
      success: true,
      message: "Task added successfully",
      data: newTask,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error saving task" });
  }
});

// -----------------------------
// Start server
// -----------------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
