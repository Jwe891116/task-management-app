import {
    fetchAllTasks,
    createTask,
    toggleTaskStatus,
    removeTask,
    modifyTask,
    countTasks
  } from "../models/userModel.js";
  
  // Get all tasks
  export const getAllTasks = async (req, res) => {
    try {
        const { search, filter, priority, page } = req.query;
        const currentPage = parseInt(page) || 1;
        const pageSize = 5;
        
        const tasks = await fetchAllTasks(search, filter || 'all', priority || 'all', currentPage, pageSize);
        const totalTasks = await countTasks(search, filter || 'all', priority || 'all');
        const totalPages = Math.ceil(totalTasks / pageSize);
        
        res.render('index', { 
            tasks, 
            errors: null,
            searchTerm: search || '',
            currentFilter: filter || 'all',
            currentPriority: priority || 'all',
            currentPage,
            totalPages,
            hasPreviousPage: currentPage > 1,
            hasNextPage: currentPage < totalPages
        });
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).send("Server Error");
    }
};
  
  // Add new task
  export const addTask = async (req, res) => {
    const { title, description, priority } = req.body;
    const errors = validateTaskInput(title, description);
    
    if (errors.length > 0) {
        try {
            const tasks = await fetchAllTasks();
            return res.render('index', { tasks, errors });
        } catch (err) {
            console.error("Error fetching tasks:", err);
            return res.status(500).send("Server Error");
        }
    }
    
    try {
        await createTask(title, description, priority);
        res.redirect('/');
    } catch (err) {
        console.error("Error adding task:", err);
        res.status(500).send("Server Error");
    }
};
  
  // Toggle task completion status
  export const toggleTaskCompletion = async (req, res) => {
    const taskId = parseInt(req.params.id);
    
    try {
      await toggleTaskStatus(taskId);
      res.redirect('/');
    } catch (err) {
      console.error("Error toggling task:", err);
      res.status(500).send("Server Error");
    }
  };
  
  // Delete a task
  export const deleteTask = async (req, res) => {
    const taskId = parseInt(req.params.id);
    
    try {
      await removeTask(taskId);
      res.redirect('/');
    } catch (err) {
      console.error("Error deleting task:", err);
      res.status(500).send("Server Error");
    }
  };
  
  // Update task (title and description)
  export const updateTask = async (req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, description, priority } = req.body;
    const errors = validateTaskInput(title, description);
    
    if (errors.length > 0) {
        try {
            const tasks = await fetchAllTasks();
            return res.render('index', { tasks, errors });
        } catch (err) {
            console.error("Error fetching tasks:", err);
            return res.status(500).send("Server Error");
        }
    }
    
    try {
        await modifyTask(taskId, title, description, priority);
        res.redirect('/');
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).send("Server Error");
    }
};
  
  // Helper function for input validation
  function validateTaskInput(title, description) {
    const errors = [];
    
    // Title validation
    if (!title || title.trim().length === 0) {
      errors.push("Title is required");
    } else if (title.trim().length < 3) {
      errors.push("Title must be at least 3 characters");
    } else if (title.trim().length > 100) {
      errors.push("Title cannot exceed 100 characters");
    }
  
    // Description validation
    if (!description) {
      errors.push("Description is required");
    } else if(description.trim().length > 500) {
      errors.push("Description cannot exceed 500 characters");
    }
  
    return errors;
  }