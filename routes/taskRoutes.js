// Import Express framework to create a web server
import express from "express";

// Create a router object to handle routes
const router = express.Router();

// Import the 'path' module 
import path from "path";

// Initialize an empty array to store tasks
let tasks = [
    {id: 1, title: "Task 1", description: "Description for Task 1", completed: true, priority: "Medium"},
    {id: 2, title: "Task 2", description: "Description for Task 2", completed: false, priority: "High"},
    {id: 3, title: "Task 3", description: "Description for Task 3", completed: true, priority: "Low"},
    {id: 4, title: "Task 4", description: "Description for Task 4", completed: false, priority: "High"},
    {id: 5, title: "Task 5", description: "Description for Task 5", completed: false, priority: "Medium"},
];

// Initialize a counter to assign unique IDs to tasks
let idCounter = 1;

// Render the 'index' view and pass the 'tasks' array to it
router.get("/", (req, res) => {
    res.render('index', {tasks});
});

// Adds new task to array and redirects back to home page
router.post('/add-task', (req, res) => {
    const { title, description, priority} = req.body;
    if (!title) {
        return res.status(400).send("Title, description and priority are required.");
      }
    tasks.push({ id: idCounter++, title, description, completed: false, priority});
    res.redirect('/');
});

// Toggles task status and redirects to home page
router.post('/toggle-task/:id', (req, res) => {
    const taskId = parseInt(req.params.id); // Convert the ID from a string to a number
    const task = tasks.find(t => t.id === taskId); // Find the task by ID
    task.completed = !task.completed; // Toggle the completion status
    res.redirect('/');
});

// Deletes a task and redirects to home page
router.post('/delete-task/:id', (req, res) => {
    const taskId = parseInt(req.params.id); // Convert the ID from a string to a number
    tasks = tasks.filter(t => t.id !== taskId); // Remove the task from the array
    res.redirect('/');
});

// Search for a task
router.get('/search', (req, res) => {
    const query = req.query.query?.toLowerCase(); // Ensure query is defined
    if (!query) {
        return res.redirect('/');
    }

    const filteredTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.description.toLowerCase().includes(query)
    );

    res.render('index', { tasks: filteredTasks }); // Display search results
});

//Filter tasks
router.get('/filter-tasks', (req, res) => {
    const filter = req.query.filter;
    let filteredTasks = tasks;

    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'incomplete') {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    res.render('index', { tasks: filteredTasks });
});

//Sort by priority
router.get('/sort-tasks', (req, res) => {
    const sortBy = req.query.sort;
    let sortedTasks = [...tasks];

    if (sortBy === 'priority') {
        sortedTasks.sort((a, b) => {
            const priorityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    } else if (sortBy === 'title') {
        sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
    }

    res.render('index', { tasks: sortedTasks });
});

router.get("/tasks", (req, res) => {
    res.json(tasks);
  });

export default router;