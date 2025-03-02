// Import Express framework to create a web server
import express from "express";

// Create a router object to handle routes
const router = express.Router();

// Import the 'path' module 
import path from "path";

// Initialize an empty array to store tasks
let tasks = [];

// Initialize a counter to assign unique IDs to tasks
let idCounter = 1;

// When a GET request is made to the root URL, render the 'index' view and pass the 'tasks' array to it
app.get('/', (req, res) => {
    res.render('index', { tasks });
});

// When a POST request is made to '/add-task', extract the 'title' and 'description' from the request body
// Create a new task object with a unique ID, the extracted data, and set 'completed' to false
// Add the new task to the 'tasks' array and redirect the user back to the home page
app.post('/add-task', (req, res) => {
    const { title, description } = req.body;
    tasks.push({ id: idCounter++, title, description, completed: false });
    res.redirect('/');
});

// When a POST request is made to '/toggle-task/:id', extract the task ID from the URL parameters
// Find the task in the 'tasks' array with the matching ID
// If the task is found, toggle its 'completed' status (true to false or false to true)
// Redirect the user back to the home page
app.post('/toggle-task/:id', (req, res) => {
    const taskId = parseInt(req.params.id); // Convert the ID from a string to a number
    const task = tasks.find(t => t.id === taskId); // Find the task by ID
    if (task) {
        task.completed = !task.completed; // Toggle the completion status
    }
    res.redirect('/');
});

// When a POST request is made to '/delete-task/:id', extract the task ID from the URL parameters
// Filter out the task with the matching ID from the 'tasks' array
// Redirect the user back to the home page
app.post('/delete-task/:id', (req, res) => {
    const taskId = parseInt(req.params.id); // Convert the ID from a string to a number
    tasks = tasks.filter(t => t.id !== taskId); // Remove the task from the array
    res.redirect('/');
});

export default router;