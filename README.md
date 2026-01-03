# ✨ DutyDeck 
### Task Management System - Empowering teams with seamless task tracking, collaboration, and deadline enforcement.

## 🚀 at a Glance
Admin View: Create, assign, and manage tasks across employees. Monitor progress, deadlines, and comments in one place.

Employee View: See assigned tasks, update status, ask questions, and get smart reminders if deadlines pass.

Smart Intelligence: Deadline auto-failure, real-time UI sync, and individual progress tracking — even on shared tasks.

## 📌 Key Features
### 👨‍💼 Admin Dashboard
Create tasks with deadlines and multi-employee assignments

Monitor statuses: Pending, In Progress, Completed, Failed

Add comments/queries and manage or delete tasks

Visualize stats and insights per user or status

### 👷‍♀️ Employee Portal
Secure login using JWT

View and update only your tasks

Raise/view comments for clarification

Tasks auto-flagged Failed if past deadline

### 🧠 System Highlights
Deadline Enforcement: Auto-mark tasks as failed when overdue

Individual Status: Track each employee’s progress separately

Real-Time Sync: Live updates for tasks, stats, and comments

## 🛠️ Tech Stack
Layer	Technologies
Frontend	React.js • Tailwind CSS • Axios • React Router
Backend	Node.js • Express.js • MongoDB/Mongoose • JWT Auth

## 📥 Installation
Clone the repo and get started:
```bash
git clone https://github.com/Sukhankar/DutyDeck.git
cd DutyDeck
```

## Start Backend
```bash
cd server
npm install && npm run dev
```

## Start Frontend
```bash
cd client
npm install && npm run dev
```
🔐 Authentication & Access
JWT-based, role-specific access (Admin vs Employee)

All API endpoints protected with secure middleware

Token safely stored on the client side

## 🛠️ Future Plans
📬 Notifications via email/SMS on new/urgent tasks

📎 Attachments: Allow file uploads with tasks

📊 Advanced dashboard: Analytics for admins

📤 Export: CSV/PDF reporting for tasks

## 📄 License
Licensed under the [MIT License](LICENSE).

## 👨‍💻 Maintainers
Built with ❤️ by [Sukhankar](https://github.com/Sukhankar) and [Subhan](https://github.com/SubhanKhalif)
