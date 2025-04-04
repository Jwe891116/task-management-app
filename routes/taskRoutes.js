// // Import Express framework to create a web server
// import express from "express";

// // Create a router object to handle routes
// const router = express.Router();

// // Import the 'path' module 
// import path from "path";

// // Initialize an empty array to store tasks
// let tasks = [];

// // Initialize a counter to assign unique IDs to tasks
// let idCounter = 1;

// // Render the 'index' view and pass the 'tasks' array to it
// router.get("/", (req, res) => {
//     res.render('index', {tasks});
// });

// // Adds new task to array and redirects back to home page
// router.post('/add-task', (req, res) => {
//     const { title, description, priority} = req.body;
//     if (!title) {
//         return res.status(400).send("Title, description and priority are required.");
//       }
//     tasks.push({ id: idCounter++, title, description, completed: false, priority});
//     res.redirect('/');
// });

// // Toggles task status and redirects to home page
// router.post('/toggle-task/:id', (req, res) => {
//     const taskId = parseInt(req.params.id); // Convert the ID from a string to a number
//     const task = tasks.find(t => t.id === taskId); // Find the task by ID
//     task.completed = !task.completed; // Toggle the completion status
//     res.redirect('/');
// });

// // Deletes a task and redirects to home page
// router.post('/delete-task/:id', (req, res) => {
//     const taskId = parseInt(req.params.id); // Convert the ID from a string to a number
//     tasks = tasks.filter(t => t.id !== taskId); // Remove the task from the array
//     res.redirect('/');
// });

// // Search for a task
// router.get('/search', (req, res) => {
//     const query = req.query.query?.toLowerCase(); // Ensure query is defined
//     if (!query) {
//         return res.redirect('/');
//     }

//     const filteredTasks = tasks.filter(task => 
//         task.title.toLowerCase().includes(query) || 
//         task.description.toLowerCase().includes(query)
//     );

//     res.render('index', { tasks: filteredTasks }); // Display search results
// });

// //Filter tasks
// router.get('/filter-tasks', (req, res) => {
//     const filter = req.query.filter;
//     let filteredTasks = tasks;

//     if (filter === 'completed') {
//         filteredTasks = tasks.filter(task => task.completed);
//     } else if (filter === 'incomplete') {
//         filteredTasks = tasks.filter(task => !task.completed);
//     }

//     res.render('index', { tasks: filteredTasks });
// });

// //Sort by priority
// router.get('/sort-tasks', (req, res) => {
//     const sortBy = req.query.sort;
//     let sortedTasks = [...tasks];

//     if (sortBy === 'priority') {
//         sortedTasks.sort((a, b) => {
//             const priorityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
//             return priorityOrder[b.priority] - priorityOrder[a.priority];
//         });
//     } else if (sortBy === 'title') {
//         sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
//     }

//     res.render('index', { tasks: sortedTasks });
// });

// router.get("/tasks", (req, res) => {
//     res.json(tasks);
//   });

// export default router;

import express from "express";
import {
  getAllTasks,
  addTask,
  toggleTaskCompletion,
  deleteTask,
  updateTask
} from "../controllers/userController.js";

const router = express.Router();

// Get all tasks
router.get("/", getAllTasks);

// Add new task
router.post('/tasks', addTask);

// Toggle task completion status
router.patch('/tasks/:id', toggleTaskCompletion);

// Delete a task
router.delete('/tasks/:id', deleteTask);

// Update task (title and description)
router.put('/tasks/:id', updateTask);

export default router;