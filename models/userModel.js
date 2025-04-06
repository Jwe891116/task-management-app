import { pool } from "../config/db.js";

// Get all tasks from database with optional filters
export const fetchAllTasks = async (searchTerm = '', filter = 'all', priority = 'all', page = 1, pageSize = 5) => {
  const offset = (page - 1) * pageSize;
  let query = "SELECT * FROM tasks";
  const params = [];
  
  // Build WHERE clauses based on filters
  const whereClauses = [];
  
  if (searchTerm) {
      whereClauses.push("(title ILIKE $1 OR description ILIKE $1)");
      params.push(`%${searchTerm}%`);
  }
  
  if (filter !== 'all') {
      whereClauses.push(`completed = ${filter === 'completed'}`);
  }
  
  if (priority !== 'all') {
      whereClauses.push("priority = $" + (params.length + 1));
      params.push(priority);
  }
  
  if (whereClauses.length > 0) {
      query += " WHERE " + whereClauses.join(" AND ");
  }
  
  query += ` ORDER BY 
      CASE priority 
          WHEN 'High' THEN 1 
          WHEN 'Medium' THEN 2 
          WHEN 'Low' THEN 3 
      END, created_at 
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  
  params.push(pageSize, offset);
  
  const result = await pool.query(query, params);
  return result.rows;
};

// Count total tasks for pagination
export const countTasks = async (searchTerm = '', filter = 'all', priority = 'all') => {
  let query = "SELECT COUNT(*) FROM tasks";
  const params = [];
  
  const whereClauses = [];
  
  if (searchTerm) {
      whereClauses.push("(title ILIKE $1 OR description ILIKE $1)");
      params.push(`%${searchTerm}%`);
  }
  
  if (filter !== 'all') {
      whereClauses.push(`completed = ${filter === 'completed'}`);
  }
  
  if (priority !== 'all') {
      whereClauses.push("priority = $" + (params.length + 1));
      params.push(priority);
  }
  
  if (whereClauses.length > 0) {
      query += " WHERE " + whereClauses.join(" AND ");
  }
  
  const result = await pool.query(query, params);
  return parseInt(result.rows[0].count);
};

// Create a new task in database
export const createTask = async (title, description, priority) => {
  await pool.query(
      "INSERT INTO tasks (title, description, priority) VALUES ($1, $2, $3)",
      [title.trim(), description?.trim() || null, priority]
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
export const modifyTask = async (taskId, title, description, priority) => {
  await pool.query(
      "UPDATE tasks SET title = $1, description = $2, priority = $4 WHERE id = $3",
      [title.trim(), description?.trim() || null, taskId, priority]
  );
};