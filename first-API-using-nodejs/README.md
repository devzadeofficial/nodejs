# Session 1

## Build It Live: Your First Node.js REST API

A simple Task Management REST API built with Node.js and Express.

## Features

- Create new tasks
- Retrieve all tasks
- Persistent storage using JSON file

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install express
   ```

## Usage

Start the server:
```bash
node server.js
```

The server will run on `http://localhost:3000`

## API Endpoints

### Get All Tasks

```
GET /tasks
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1234567890,
      "title": "Example task",
      "completed": false
    }
  ]
}
```

### Create a Task

```
POST /tasks
```

**Request Body:**
```json
{
  "title": "Your task title"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task added successfully",
  "data": {
    "id": 1234567890,
    "title": "Your task title",
    "completed": false
  }
}
```

## Project Structure

```
nodejs/
├── server.js      # Main application file
├── tasks.json     # Data storage (auto-created)
└── README.md      # Documentation
```

## Testing with cURL

**Get all tasks:**
```bash
curl http://localhost:3000/tasks
```

**Create a new task:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "My first task"}'
```
