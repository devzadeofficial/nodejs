/**
 * Task Management REST API
 * A simple Node.js + Express API for managing tasks
 *
 * Features:
 * - Create new tasks
 * - Retrieve all tasks
 * - File-based storage using JSON
 */

// Load environment variables from .env file
require("dotenv").config();

// Import required modules
const express = require("express");
const fs = require("fs");
const path = require("path");

// Initialize Express application
const app = express();

// Middleware: Parse incoming JSON request bodies
app.use(express.json());

// Configuration: Path to JSON file for storing tasks
const DATA_FILE = path.join(__dirname, "tasks.json");

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Load tasks from the JSON file
 * Creates an empty file if it doesn't exist
 * @returns {Array} Array of task objects
 */
function loadTasks() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
  const data = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(data);
}

/**
 * Save tasks to the JSON file
 * @param {Array} tasks - Array of task objects to save
 */
function saveTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// ============================================
// API ROUTES
// ============================================

/**
 * Health Check Endpoint
 * GET /
 * Returns a simple message to verify server is running
 */
app.get("/", (req, res) => {
  res.json({
    message: "Task Management API is running",
    version: "1.0.0",
    endpoints: {
      health: "GET /",
      getAllTasks: "GET /tasks (optional: ?filter=completed|pending|all)",
      getTaskById: "GET /tasks/:id",
      createTask: "POST /tasks",
    },
  });
});

/**
 * Get All Tasks
 * GET /tasks
 * Returns all tasks from the database with optional filtering
 *
 * Query Parameters:
 *   - filter: Filter by completion status (completed, pending, all)
 *     Example: GET /tasks?filter=completed
 *     Example: GET /tasks?filter=pending
 *
 * Response: { success: true, count: number, data: [] }
 */
app.get("/tasks", (req, res) => {
  try {
    let tasks = loadTasks();
    const { filter } = req.query;

    // Apply filter if provided
    if (filter) {
      if (filter === "completed") {
        tasks = tasks.filter((task) => task.completed === true);
      } else if (filter === "pending") {
        tasks = tasks.filter((task) => task.completed === false);
      } else if (filter !== "all") {
        // Invalid filter value
        return res.status(400).json({
          success: false,
          message: "Invalid filter value. Use 'completed', 'pending', or 'all'",
        });
      }
    }

    res.json({
      success: true,
      count: tasks.length,
      filter: filter || "all",
      data: tasks,
    });
  } catch (err) {
    console.error("Error reading tasks:", err);
    res.status(500).json({
      success: false,
      message: "Error reading tasks",
    });
  }
});

/**
 * Get Task by ID
 * GET /tasks/:id
 * Returns a specific task by its ID
 *
 * URL Parameter: id - The unique task ID
 * Response: { success: true, data: {} }
 */
app.get("/tasks/:id", (req, res) => {
  try {
    const tasks = loadTasks();
    const taskId = parseInt(req.params.id);

    // Find task by ID
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (err) {
    console.error("Error retrieving task:", err);
    res.status(500).json({
      success: false,
      message: "Error retrieving task",
    });
  }
});

/**
 * Create New Task
 * POST /tasks
 * Creates a new task and saves it to the database
 *
 * Request Body: { "title": "Task name" }
 * Response: { success: true, message: string, data: {} }
 */
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  // Validation: Ensure title is provided and not empty
  if (!title || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }

  try {
    const tasks = loadTasks();

    // Create new task object
    const newTask = {
      id: Date.now(), // Use timestamp as unique ID
      title: title.trim(),
      completed: false,
    };

    // Add task to array and save
    tasks.push(newTask);
    saveTasks(tasks);

    // Return success response with created task
    res.status(201).json({
      success: true,
      message: "Task added successfully",
      data: newTask,
    });
  } catch (err) {
    console.error("Error saving task:", err);
    res.status(500).json({
      success: false,
      message: "Error saving task",
    });
  }
});

// ============================================
// START SERVER
// ============================================

// Get port from environment variables or use default
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`✓ Press Ctrl+C to stop`);
});
