# ? AI Task Manager & Productivity Platform

A modern, full-stack enterprise productivity platform powered by **Claude AI**, built with **React.js, Node.js, Express, MongoDB, JWT Authentication, and Tailwind CSS**.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20TailwindCSS-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![Claude AI](https://img.shields.io/badge/AI-Claude%20API-D97706?logo=anthropic)

---

## ?? Key Features

### ?? Intelligent AI Workflow (Claude API Integration)
- **Automatic Task Decomposition**: Automatically breaks high-level tasks into actionable subtasks with estimated time and effort.
- **Priority Reasoning**: Evaluates urgency and importance, giving clear justification for priority levels.
- **Productivity & Execution Tips**: Generates strategic recommendations tailored to each task.
- **One-Click AI Solver**: Generates comprehensive execution blueprints and guides with copyable code snippets directly within the task card.

### ?? Enterprise Security & Authentication
- **Secure JWT Architecture**: Stateless authentication using bearer tokens and HTTP interceptors.
- **Strict Password Policy**: Regex-enforced validation (minimum 8 characters, uppercase, lowercase, numbers, and special symbols).
- **Time-Sensitive OTP Verification**: 60-second time-based OTP sent via Google SMTP with a real-time countdown timer on the frontend.
- **Role-Based Access Control (RBAC)**: Separate permissions and routing for standard users and platform administrators.

### ??? Super Admin Control Center
- **Real-Time System Metrics**: Total users, total tasks, and completion velocity.
- **User Administration**: Comprehensive CRUD (Create, Read, Update, Delete) for system users with safe safeguards against deleting root admin.
- **Global Activity Feed**: Real-time cross-platform inspection of tasks created by all users.
- **Database Backup**: One-click JSON export for full disaster recovery and offline audit logs.

### ?? Modern UI & UX
- Designed with high-contrast dark mode aesthetics, glassmorphic card layouts, responsive Lucide icons, and interactive progress bars.

---

## ??? Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Axios
- **Backend**: Node.js, Express.js (ES Modules)
- **Database**: MongoDB & Mongoose ODM
- **AI Integration**: Anthropic Claude API (@anthropic-ai/sdk) with resilient offline fallback
- **Mailing Service**: Nodemailer (Gmail SMTP)
- **Security**: JWT (jsonwebtoken), Bcryptjs, Regex Password Validation

---

## ?? Getting Started

### 1. Clone the Repository
\\\ash
git clone https://github.com/<YOUR_USERNAME>/ai-task-manager.git
cd ai-task-manager
\\\

### 2. Backend Setup
\\\ash
cd backend
npm install
\\\

Create a \.env\ file in the \ackend\ directory (reference \.env.example\):
\\\env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai_task_manager
JWT_SECRET=your_jwt_secret_key
CLAUDE_API_KEY=your_anthropic_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_google_app_password
\\\

Start the backend development server:
\\\ash
npm run dev
\\\

### 3. Frontend Setup
In a new terminal window:
\\\ash
cd frontend
npm install
npm run dev
\\\

Open **http://localhost:5173** in your browser.

---

## ?? Author
- **Muhammad Yasir** - Full-Stack Developer
