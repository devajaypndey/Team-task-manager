# 🚀 Team Task Manager

A comprehensive full-stack task management application designed for teams to collaborate efficiently. Features include user authentication, role-based access control, project creation, task assignment, and real-time status tracking.

---

## ✨ Key Features

- **🔐 Robust Authentication**: Secure login and signup using JWT and Bcryptjs.
- **👨‍💼 Admin Dashboard**: Centralized management for all users and projects.
- **📁 Project Management**: Create projects and manage team members with role-based permissions.
- **📋 Task Tracking**: Assign tasks, set deadlines, and track progress through different statuses.
- **🎨 Modern UI/UX**: Built with React and Tailwind CSS v4 for a sleek, responsive experience.
- **⚡ Efficient Data Fetching**: Utilizes React Query for optimized server state management.

---

## 🛠️ Tech Stack

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express**: Fast, unopinionated, minimalist web framework.
- **MongoDB & Mongoose**: NoSQL database for flexible data storage.
- **JWT**: Secure authentication via JSON Web Tokens.
- **Multer**: Middleware for handling multipart/form-data (file uploads).

### Frontend
- **React (Vite)**: Modern frontend library for building user interfaces.
- **Tailwind CSS v4**: Utility-first CSS framework for rapid styling.
- **React Query**: Powerful asynchronous state management.
- **React Router Dom**: Dynamic routing for single-page applications.
- **Axios**: Promise-based HTTP client for the browser and Node.js.

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine.
- MongoDB database (local or Atlas).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/devajaypndey/Team-task-manager.git
   cd Team-task-manager
   ```

2. **Backend Setup**:
   - Navigate to the `backend` folder: `cd backend`
   - Install dependencies: `npm install`
   - Create a `.env` file and add the following:
     ```env
     MONGO_URL=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     ```
   - Start the server: `npm run dev`

3. **Frontend Setup**:
   - Navigate to the `client` folder: `cd ../client`
   - Install dependencies: `npm install`
   - Start the development server: `npm run dev`

---

## 📁 Project Structure

```text
Team_Task_Manager/
├── backend/            # Express server & API routes
│   ├── src/            # Source code
│   │   ├── controllers/# Route controllers
│   │   ├── models/     # Mongoose models
│   │   ├── routes/     # API endpoints
│   │   └── app.js      # Express app setup
│   └── server.js       # Entry point
├── client/             # React frontend
│   ├── src/            # Source code
│   │   ├── api/        # Axios instances & API calls
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   └── routes/     # Routing configuration
│   └── vite.config.js  # Vite configuration
└── README.md           # Project documentation
```

---

