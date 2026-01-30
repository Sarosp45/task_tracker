# Task Tracker

## Quick Start

**Backend:**
```bash
cd tasktracker
pip install django django-cors-headers
python manage.py runserver
```

**Frontend:**
```bash
cd tasktracker-ui
npm install
npm start
```

Then open http://localhost:3000

## Test Login

- Username: `testuser`
- Password: `Test@123`

## What it does

- Sign up / login / logout
- Add tasks with title, description, and status
- Edit and delete tasks
- Filter by status (Open, In Progress, Completed)

## API

**Auth:**
- `POST /api/auth/signup/` - create account
- `POST /api/auth/login/` - login
- `POST /api/auth/logout/` - logout

**Tasks:**
- `GET /api/tasks/` - get all tasks
- `GET /api/tasks/?status=Open` - filter by status
- `POST /api/tasks/` - create task
- `PUT /api/tasks/<id>` - update task
- `DELETE /api/tasks/<id>` - delete task

## Tech Stack

- **Backend:** Django, Python
- **Frontend:** React, React Router
- **Storage:** In-memory (no database)
