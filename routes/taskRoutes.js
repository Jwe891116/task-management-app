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

//R ender the 'index' view and pass the 'tasks' array to it
router.get("/", (req, res) => {
    res.render('index', {tasks});
});

//Adds new task to array and redirects back to home page
router.post('/add-task', (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).send("Title and description are required.");
      }
    tasks.push({ id: idCounter++, title, description, completed: false });
    res.redirect('/');
});

//Toggles task status and redirects to home page
router.post('/toggle-task/:id', (req, res) => {
    const taskId = parseInt(req.params.id); // Convert the ID from a string to a number
    const task = tasks.find(t => t.id === taskId); // Find the task by ID
    if (!task){
        return res.status(400).send("Invalid task ID.")
    }
    else {
        task.completed = !task.completed; // Toggle the completion status
    }
    res.redirect('/');
});

// Deletes a task and redirects to home page
router.post('/delete-task/:id', (req, res) => {
    const taskId = parseInt(req.params.id); // Convert the ID from a string to a number
    tasks = tasks.filter(t => t.id !== taskId); // Remove the task from the array
    res.redirect('/');
});

export default router;