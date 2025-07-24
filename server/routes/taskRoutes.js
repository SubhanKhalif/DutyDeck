import express from 'express';
import {
  createTask,
  getAllTasks,
  getTasksForUser,
  getTaskStats,
  getUserInsights,
  addQueryToTask,
  deleteQuery,
  completeTask,
  updateTask,
  deleteTask,
  getUserTasks,
  getMentorUserInsights
} from '../controllers/taskController.js';

const router = express.Router();

// 🔹 Create a new task with assignedUsers
router.post('/', createTask);

// 🔹 Get all tasks (for admin)
router.get('/', getAllTasks);

// 🔹 Get tasks assigned to a specific user (by email)
router.get('/user', getTasksForUser); // ?email=user@example.com

// 🔹 Get user tasks with status filter
router.get('/user-tasks', getUserTasks); // ?email=user@example.com&status=Completed

// 🔹 Get status-wise task stats for a specific user
router.get('/stats', getTaskStats); // ?email=user@example.com

// 🔹 Admin insight panel - task completion status of all users
router.get('/user-insights', getUserInsights);

// 🔹 Mentor insight panel - task completion status of assigned users
router.get('/mentor-user-insights', getMentorUserInsights);

// 🔹 Update a specific user's task status (Pending, In Progress, Completed, Failed)
router.patch('/:taskId/status', completeTask);

// 🔹 Update the entire task (admin use - edit title, desc, deadline etc)
router.put('/:taskId', updateTask);

// 🔹 Delete a task
router.delete('/:taskId', deleteTask);

// 🔹 Add a query to a task
router.post('/:taskId/queries', addQueryToTask);

// 🔹 Delete a specific query from a task
router.delete('/:taskId/queries/:queryId', deleteQuery);

export default router;