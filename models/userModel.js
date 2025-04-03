import { pool } from "../config/db.js";

// Get all tasks from database
export const fetchAllTasks = async () => {
  const result = await pool.query("SELECT * FROM tasks ORDER BY created_at");
  return result.rows;
};

// Create a new task in database
export const createTask = async (title, description) => {
  await pool.query(
    "INSERT INTO tasks (title, description) VALUES ($1, $2)",
    [title.trim(), description?.trim() || null]
  );
};

// Toggle task completion status in database
export const toggleTaskStatus = async (taskId) => {
  await pool.query(
    "UPDATE tasks SET completed = NOT completed WHERE id = $1",
    [taskId]
  );
};

// Delete a task from database
export const removeTask = async (taskId) => {
  await pool.query("DELETE FROM tasks WHERE id = $1", [taskId]);
};

// Update task title and description in database
export const modifyTask = async (taskId, title, description) => {
  await pool.query(
    "UPDATE tasks SET title = $1, description = $2 WHERE id = $3",
    [title.trim(), description?.trim() || null, taskId]
  );
};