
# Teacher Management System

A full-stack web application designed to simplify teacher management, attendance tracking, and leave request administration.

## Features

- **Authentication:** User registration and login.
- **Dashboard:** Overview of the management system.
- **Teacher Management:** Add, edit, delete, and search teachers.
- **Attendance Tracking:** Record and view teacher attendance.
- **Leave Requests:** Submit, approve, and reject leave requests.
- **Responsive Interface:** Clean and user-friendly dashboard.

## Technologies Used

### Frontend
- React.js
- CSS
- Vite
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT

## Project Structure

```text
teacher-management/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   └── src/
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/11Roma/teacher-management.git
cd teacher-management
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/teacher_management
JWT_SECRET=your_secret_key
```

### 3. Start the backend

```bash
node server.js
```

### 4. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

## Database

This project uses MongoDB. Make sure MongoDB is running before starting the backend.

## Author

**11Roma**

GitHub: [11Roma](https://github.com/11Roma)
