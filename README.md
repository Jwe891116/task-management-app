# Task Management App
This is a simple Task Management App built with Node.js, Express, and EJS for templating. It allows users to add, delete, search, filter, and sort tasks.

## Prerequisites
Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 14 or later)
- npm (comes with Node.js)

## Installation

1. Clone the repositorye.

```
   git clone <gh repo clone Jwe891116/task-management-app>
```
2. Install the dependencies.

```
   npm install
```

## Running the Application

1. Start the server.

```
   npm start
```

2. Open your browser and navigate to:

```
   http://localhost:3001/
```

## Features

- **Add Tasks**: Enter a title, description, and priority.
- **Delete Tasks**: Remove a task from the list.
- **Mark Tasks as Completed**: Toggle between completed and incomplete status.
- **Search Tasks**: Find tasks by title or description.
- **Filter Tasks**: View only completed, incomplete, or all tasks.
- **Sort Tasks**: Sort by title or priority.

## Project Structure

```
|-- routes/
|   |-- taskRoutes.js  # Handles task-related routes
|-- views/
|   |-- index.ejs      # Main frontend template
|-- public/
|   |-- style.css      # CSS file (if applicable)
|-- app.js             # Main server file
|-- package.json       # Project metadata and dependencies
```

## API Endpoints

| Method | Route              | Description                       |
| ------ | ------------------ | --------------------------------- |
| GET    | `/`                | View tasks                        |
| POST   | `/add-task`        | Add a new task                    |
| POST   | `/toggle-task/:id` | Mark task as completed/incomplete |
| POST   | `/delete-task/:id` | Delete a task                     |
| GET    | `/search`          | Search tasks by title/description |
| GET    | `/filter-tasks`    | Filter tasks by status            |
| GET    | `/sort-tasks`      | Sort tasks by priority/title      |
| GET    | `/tasks`           | Get all tasks in JSON format      |

## Link to Youtube video
https://youtu.be/CW8jWyseucU
