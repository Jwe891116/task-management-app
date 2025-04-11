// Import Express framework and controller functions
import express from "express";
import {
  getAllTasks,
  addTask,
  toggleTaskCompletion,
  deleteTask,
  updateTask,
  prepareEditTask  
} from "../controllers/userController.js";

// Create an Express Router instance
const router = express.Router();

// Route: GET /
// Description: Get all tasks
// Controller: getAllTasks
router.get("/", getAllTasks);

// Route: POST /tasks
// Description: Add a new task
// Controller: addTask
router.post('/tasks', addTask);

// Route: POST /edit-task
// Description: Prepare to edit a task (fetch task details)
// Controller: prepareEditTask
router.post('/edit-task', prepareEditTask);

// Route: PATCH /tasks/:id
// Description: Toggle task completion status
// Controller: toggleTaskCompletion
router.patch('/tasks/:id', toggleTaskCompletion);

// Route: DELETE /tasks/:id
// Description: Delete a task
// Controller: deleteTask
router.delete('/tasks/:id', deleteTask);

// Route: PUT /tasks/:id
// Description: Update task details (title, description and priority)
// Controller: updateTask
router.put('/tasks/:id', updateTask);

// Export the router for use in the main application
export default router;