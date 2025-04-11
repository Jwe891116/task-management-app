// Import necessary modules
import express from "express";                    // Express framework for building the server
import taskRoutes from "./routes/taskRoutes.js";  // Custom routes for task-related endpoints
import path from "path";                          // Path module for working with file and directory paths
import { pool } from "./config/db.js";            // Database connection pool
import methodOverride from "method-override";     // Middleware for HTTP method overriding

// Initialize Express application
const app = express();

// Middleware setup
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(process.cwd(), "public"))); // Serve static files from public directory

// Method override middleware to support PUT/DELETE 
app.use(methodOverride('_method', { 
  methods: ['POST', 'GET'] 
}));

// Template engine configuration
app.set("view engine", "ejs");                       // Set EJS as the view engine
app.set("views", path.join(process.cwd(), "views")); // Set views directory path

/**
 * Logging middleware
 * Logs timestamp, HTTP method, and URL of each incoming request
 */
const loggingMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString(); 
    console.log(`[${timestamp}] ${req.method} ${req.url}`); 
    next(); // Pass control to the next middleware
};

// Register middleware
app.use(loggingMiddleware);  // Apply logging to all requests
app.use("/", taskRoutes);    // Mount task routes at root path

// 404 Error handler middleware
app.use((req, res) => {
  res.status(404).send("404 Not Found.\n"); // Send response for unmatched routes
});

// Server configuration
const PORT = 3001; // Port number for the server to listen on

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`); // Log server startup
});