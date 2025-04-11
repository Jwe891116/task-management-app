import {
  fetchAllTasks,
  createTask,
  toggleTaskStatus,
  removeTask,
  modifyTask,
  getTotalTasksCount
} from "../models/userModel.js";

// Controller function to get all tasks with optional filtering and pagination
export const getAllTasks = async (req, res) => {
  try {
    // Extract query parameters for search, filters, and pagination
    const { search, filter, priority, page = 1 } = req.query;
    const pageSize = 10; // Number of items per page
    // Fetch tasks based on filters and pagination
    const tasks = await fetchAllTasks(search, filter, priority, page, pageSize);
    // Get total count of tasks for pagination calculation
    const totalTasks = await getTotalTasksCount(search, filter, priority);
    const totalPages = Math.ceil(totalTasks / pageSize);

    // Handle error messages passed via query parameters
    const errors = req.query.errors
      ? (Array.isArray(req.query.errors)
        ? req.query.errors
        : [req.query.errors])
      : null;

    // Render the view with all necessary data
    res.render('index', {
      tasks,
      editingTask: null,  // No task is being edited initially
      errors,
      title: req.query.title || '',
      description: req.query.description || '',
      priority: req.query.priority || 'Low',
      search: search || '',
      filter: filter || 'all',
      priorityFilter: priority || 'all',
      currentPage: parseInt(page),
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).send("Server Error");
  }
};

// Controller function to add a new task
export const addTask = async (req, res) => {
  // Extract task data from request body
  const { title, description } = req.body;
  const priority = req.body.priority || 'Low'; // Default priority if not provided
  // Validate input fields
  const errors = validateTaskInput(title, description);

  // If validation errors exist, redirect back with error messages
  if (errors.length > 0) {
    const queryParams = new URLSearchParams();
    errors.forEach(e => queryParams.append('errors', e));
    queryParams.set('title', title);
    if (description) queryParams.set('description', description);
    return res.redirect(`/?${queryParams.toString()}`);
  }

  try {
    // Create new task in the database
    await createTask(title, description, priority);
    res.redirect('/');
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).send("Server Error");
  }
};

// Controller function to toggle a task's completion status
export const toggleTaskCompletion = async (req, res) => {
  const taskId = parseInt(req.params.id);
  try {
    // Update task's completion status in database
    await toggleTaskStatus(taskId);
    // Redirect back to the index page
    res.redirect(req.headers.referer || '/');
  } catch (err) {
    console.error("Error toggling task:", err);
    res.status(500).send("Server Error");
  }
};

// Controller function to delete a task
export const deleteTask = async (req, res) => {
  const taskId = parseInt(req.params.id);
  try {
    // Remove task from database
    await removeTask(taskId);
    // Redirect back to the previous page
    res.redirect(req.headers.referer || '/');
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send("Server Error");
  }
};

// Controller function to update a task's details
export const updateTask = async (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, description } = req.body;
  const priority = req.body.priority || 'Low'; // Default priority if not provided
  // Validate input fields
  const errors = validateTaskInput(title, description);

  // If validation errors exist, redirect back with error messages
  if (errors.length > 0) {
    const errorQuery = errors.map(e => encodeURIComponent(e)).join('&errors=');
    return res.redirect(`/?errors=${errorQuery}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description || '')}`);
  }

  try {
    // Update task in the database
    await modifyTask(taskId, title, description, priority);
    res.redirect('/');
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).send("Server Error");
  }
};

// Helper function to validate task input fields
function validateTaskInput(title, description) {
  const errors = [];

  // Validate title field
  if (!title || title.trim().length === 0) {
    errors.push("Title is required");
  } else if (title.trim().length < 3) {
    errors.push("Title must be at least 3 characters");
  } else if (title.trim().length > 100) {
    errors.push("Title cannot exceed 100 characters");
  }

  // Validate description field
  if (!description) {
    errors.push("Description is required");
  } else if(description.trim().length > 500) {
    errors.push("Description cannot exceed 500 characters");
  }

  return errors;
}

// Controller function to prepare a task for editing
export const prepareEditTask = async (req, res) => {
  // Extract task details from request body
  const { taskId, title, description, priority } = req.body;
  
  // Get current filter values from the referer URL
  const refererUrl = new URL(req.headers.referer);
  const search = refererUrl.searchParams.get('search') || '';
  const filter = refererUrl.searchParams.get('filter') || 'all';
  const priorityFilter = refererUrl.searchParams.get('priority') || 'all';
  const page = refererUrl.searchParams.get('page') || 1;

  try {
    // Fetch tasks with current filters for the view
    const tasks = await fetchAllTasks(search, filter, priorityFilter, page, 10);
    const totalTasks = await getTotalTasksCount(search, filter, priorityFilter);
    const totalPages = Math.ceil(totalTasks / 10);

    // Render view with task data for editing
    res.render('index', {
      tasks,
      editingTask: {  // Task being edited
        id: taskId,
        title,
        description,
        priority
      },
      errors: null,
      title: '',
      description: '',
      priority: 'Low',
      search: search || '',
      filter: filter || 'all',
      priorityFilter: priorityFilter || 'all',
      currentPage: parseInt(page),
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages
    });
  } catch (err) {
    console.error("Error preparing to edit task:", err);
    res.status(500).send("Server Error");
  }
};