// Import necessary modules
import express from "express"; // Import express framework
import taskRoutes from "./routes/taskRoutes.js"; // Import task routes
import path from "path"; // Import path module

// Create an instance of the Express application
const app = express();

// Middleware to parse incoming request bodies with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(process.cwd(), "public")));

// Set the view engine to EJS 
app.set("view engine", "ejs");

// Directory where the views (templates) are located
app.set("views", path.join(process.cwd(), "views"));

// Custom middleware to log request details 
const loggingMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString(); 
    console.log(`[${timestamp}] ${req.method} ${req.url}`); 
    next(); 
};

// Use the logging middleware for all incoming requests
app.use(loggingMiddleware);

// Use the task routes for requests starting with "/"
app.use("/", taskRoutes);

// Middleware to handle 404 errors (when no route matches the request)
app.use((req, res) => {
  res.status(404).send("404 Not Found.\n"); // Send a 404 response
});

// Define the port on which the server will listen
const PORT = 3015;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`); // Log the server's URL
});