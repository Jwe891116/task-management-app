# Task Management App

A full-featured web-based Task Management Application built using **Node.js**, **Express**, **PostgreSQL**, and **EJS**. This app allows users to create, read, update, delete, search, filter, sort, and paginate tasks efficiently.

---

## Features

- **Add Tasks**: Create tasks with title, description, and priority.
- **Edit Tasks**: Modify task title, description, and priority.
- **Delete Tasks**: Remove tasks from the list.
- **Mark as Completed**: Toggle task status (done/pending).
- **Search**: Search by title or description (case-insensitive).
- **Filter**: By status (`all`, `completed`, `pending`) and priority (`Low`, `Medium`, `High`).
- **Sort & Pagination**: View paginated results (10 per page), sorted by creation date.
- **Validation**: Input validation for both client and server.
- **RESTful API**: Clean RESTful routes with method override support.
- **Frontend**: Dynamic EJS templates for seamless UI updates.

---

## Prerequisites

- [Node.js] (v14+)
- [PostgreSQL]
- npm (included with Node.js)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Jwe891116/task-management-app.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup the Database

Create a PostgreSQL database and run:

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  priority VARCHAR(10) DEFAULT 'Low' CHECK (priority IN ('Low', 'Medium', 'High')),
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DB_USER=your_pg_username
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_pg_password
DB_PORT=5432
```

---

## Running the App

Start the server with:

```bash
npm start
```

Then open your browser and go to:

```
http://localhost:3001/
```

---

## Project Structure

```
|-- config/
|   |-- db.js               # PostgreSQL configuration
|-- controllers/
|   |-- userController.js   # Business logic for routes
|-- models/
|   |-- userModel.js        # SQL queries and DB functions
|-- routes/
|   |-- taskRoutes.js       # Express router definitions
|-- views/
|   |-- |partials/
|   |   |-- | header.ejs    # Partials for EJS template
            | footer.ejs
|   |-- index.ejs           # EJS template for UI
|-- public/
|   |-- style.css           # Optional styles
|-- app.js                  # Main application file
|-- .env                    # Environment configuration
|-- package.json            # Project metadata
```

---

## API Endpoints

| Method | Route             | Description                            |
|--------|-------------------|----------------------------------------|
| GET    | `/`               | Render tasks with pagination/filtering |
| POST   | `/tasks`          | Add a new task                         |
| POST   | `/edit-task`      | Load task for editing                  |
| PATCH  | `/tasks/:id`      | Toggle task completion                 |
| PUT    | `/tasks/:id`      | Update task details                    |
| DELETE | `/tasks/:id`      | Delete a task                          |

### Query Parameters (for GET `/`)

- `search` – Search term for title/description  
- `filter` – `all`, `completed`, or `pending`  
- `priority` – `all`, `Low`, `Medium`, `High`  
- `page` – Page number (pagination)

---

## Validation Rules

- Title:
  - Required
  - 3–100 characters
- Description:
  - Required
  - Max 500 characters

Errors will be passed as query strings and rendered on the UI.

---

## Database Configuration

PostgreSQL is used via the `pg` library with pooling. See `config/db.js` for full setup.

Connection tested and logged when the app starts.

---

## Demo Video

Check out the demo on YouTube:  
https://youtu.be/CW8jWyseucU (Initial Web App)
https://youtu.be/mSlDAvS43W8 (Updated Web App)

---

## License

MIT License.  
Feel free to use and customize this app as needed!
