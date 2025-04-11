import { pool } from "../config/db.js";

// Fetch all tasks 
// searchTerm: Search string for title/description (case-insensitive)
// filter: 'all', 'completed', or 'pending' tasks
// priority: 'all', 'Low', 'Medium', or 'High'
// page: Current page number for pagination
// pageSize: Number of tasks per page
export const fetchAllTasks = async (searchTerm = '', filter = 'all', priority = 'all', page = 1, pageSize = 10) => {
  let query = "SELECT * FROM tasks";
  const params = [];
  let conditions = [];

  // Add search filter if searchTerm exists
  if (searchTerm) {
    conditions.push(`(title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`);
    params.push(`%${searchTerm}%`);
  }

  // Add completion status filter if specified
  if (filter !== 'all') {
    conditions.push(`completed = $${params.length + 1}`);
    params.push(filter === 'completed');
  }

  // Add priority filter if specified
  if (priority !== 'all') {
    conditions.push(`priority = $${params.length + 1}`);
    params.push(priority);
  }

  // Combine conditions with WHERE clause if any exist
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  // Sort by creation date
  query += " ORDER BY created_at";

  // Add pagination limits
  const offset = (page - 1) * pageSize;
  query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(pageSize, offset);

  // Execute query and return results
  const result = await pool.query(query, params);
  return result.rows;
};

// Get total count of tasks matching filters (for pagination calculation)
// Uses same filters as fetchAllTasks
export const getTotalTasksCount = async (searchTerm = '', filter = 'all', priority = 'all') => {
  let query = "SELECT COUNT(*) FROM tasks";
  const params = [];
  let conditions = [];

  // Apply same filters as fetchAllTasks
  if (searchTerm) {
    conditions.push(`(title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`);
    params.push(`%${searchTerm}%`);
  }

  if (filter !== 'all') {
    conditions.push(`completed = $${params.length + 1}`);
    params.push(filter === 'completed');
  }

  if (priority !== 'all') {
    conditions.push(`priority = $${params.length + 1}`);
    params.push(priority);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  // Return total count as number
  const result = await pool.query(query, params);
  return parseInt(result.rows[0].count);
};

// Create new task in database
// title: Task title (required)
// description: Task description (optional)
// priority: Priority level (defaults to 'Low')
export const createTask = async (title, description, priority = 'Low') => {
  await pool.query(
    "INSERT INTO tasks (title, description, priority) VALUES ($1, $2, $3)",
    [title.trim(), description?.trim() || null, priority]
  );
};

// Update existing task
// taskId: ID of task to update
// title: New title
// description: New description
// priority: New priority level
export const modifyTask = async (taskId, title, description, priority) => {
  await pool.query(
    "UPDATE tasks SET title = $1, description = $2, priority = $3 WHERE id = $4",
    [title.trim(), description?.trim() || null, priority, taskId]
  );
};

// Toggle task's completion status
// taskId: ID of task to toggle
export const toggleTaskStatus = async (taskId) => {
  await pool.query(
    "UPDATE tasks SET completed = NOT completed WHERE id = $1",
    [taskId]
  );
};

// Delete task from database
// taskId: ID of task to delete
export const removeTask = async (taskId) => {
  await pool.query("DELETE FROM tasks WHERE id = $1", [taskId]);
};