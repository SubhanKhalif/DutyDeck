import { v4 as uuidv4 } from 'uuid';
import User from "../models/User.js";
import Task from "../models/Task.js";

// ✅ Create Task
export const createTask = async (req, res) => {
  try {
    const { title, date, deadline, assignTo, category, description } = req.body;

    if (!title || !date || !deadline || !assignTo || !category || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!Array.isArray(assignTo)) {
      return res.status(400).json({ message: "assignTo must be an array" });
    }

    const assignedUsers = assignTo.map(email => ({
      email,
      status: 'Pending',
      seen: false,
      seenAt: null,
      completedAt: null,
      submission: null
    }));

    const newTask = new Task({
      title,
      date,
      deadline,
      assignedUsers,
      category,
      description,
    });

    const savedTask = await newTask.save();
    res.status(201).json({ message: "Task created", task: savedTask });
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get All Tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get Tasks for Specific User
export const getTasksForUser = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const tasks = await Task.find({ "assignedUsers.email": email }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get User Tasks with Status Filter
export const getUserTasks = async (req, res) => {
  const { email, status } = req.query;

  if (!email || !status) {
    return res.status(400).json({ message: "Email and status are required" });
  }

  try {
    const tasks = await Task.find({ 'assignedUsers.email': email });

    const filtered = tasks.filter(task => {
      const assigned = task.assignedUsers.find(u => u.email === email);

      if (!assigned) return false;

      if (status === 'Seen') {
        return assigned.seen === true;
      }

      return assigned.status === status;
    });

    const result = filtered.map(task => {
      const assigned = task.assignedUsers.find(u => u.email === email);
      return {
        _id: task._id,
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        userStatus: assigned.status,
        seen: assigned.seen,
        seenAt: assigned.seenAt,
        completedAt: assigned.completedAt,
        submission: assigned.submission // Add submission field
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Failed to fetch user tasks:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Get Task Stats
export const getTaskStats = async (req, res) => {
  try {
    const { email } = req.query;
    const tasks = await Task.find({ "assignedUsers.email": email });

    const counts = {
      Pending: 0,
      "In Progress": 0,
      Completed: 0,
      Failed: 0,
    };

    tasks.forEach(task => {
      const userEntry = task.assignedUsers.find(u => u.email === email);
      if (userEntry) {
        counts[userEntry.status] = (counts[userEntry.status] || 0) + 1;
      }
    });

    const stats = [
      { label: "New task", count: counts["Pending"], bg: "bg-red-500", text: "text-white" },
      { label: "Completed task", count: counts["Completed"], bg: "bg-green-300", text: "text-gray-900" },
      { label: "In Progress", count: counts["In Progress"], bg: "bg-blue-500", text: "text-white" },
      { label: "Failed", count: counts["Failed"], bg: "bg-gray-500", text: "text-white" },
    ];

    res.status(200).json(stats);
  } catch (err) {
    console.error("Error getting task stats:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get User Insights
export const getUserInsights = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("name email");

    const insights = await Promise.all(users.map(async (user) => {
      const tasks = await Task.find({ "assignedUsers.email": user.email });

      let completed = 0, inProgress = 0, seen = 0, failed = 0;

      tasks.forEach(task => {
        const entry = task.assignedUsers.find(u => u.email === user.email);
        if (entry) {
          if (entry.status === "Completed") completed++;
          if (entry.status === "In Progress") inProgress++;
          if (entry.status === "Failed") failed++;
          if (entry.seen) seen++;
        }
      });

      return {
        name: user.name,
        email: user.email,
        total: tasks.length,
        completed,
        inProgress,
        seen,
        failed,
        lastSeen: tasks.reduce((latest, task) => {
          const entry = task.assignedUsers.find(u => u.email === user.email);
          return entry?.seenAt > latest ? entry.seenAt : latest;
        }, null),
        lastCompleted: tasks.reduce((latest, task) => {
          const entry = task.assignedUsers.find(u => u.email === user.email);
          return entry?.completedAt > latest ? entry.completedAt : latest;
        }, null)
      };
    }));

    res.status(200).json(insights);
  } catch (err) {
    console.error("Error fetching user insights:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET /tasks/mentor-user-insights
export const getMentorUserInsights = async (req, res) => {
  try {
    const mentorEmail = req.user.email;

    const mentor = await User.findOne({ email: mentorEmail });
    if (!mentor || mentor.role !== "mentor") {
      return res.status(403).json({ message: "Only mentors can access this resource." });
    }

    const assignedEmails = mentor.assignedUsers;

    // Get basic info of assigned users
    const assignedUsers = await User.find({ email: { $in: assignedEmails } }).select("name email");

    const insights = await Promise.all(assignedUsers.map(async (user) => {
      const tasks = await Task.find({ "assignedUsers.email": user.email });

      let completed = 0, inProgress = 0, failed = 0, seen = 0;

      tasks.forEach(task => {
        const entry = task.assignedUsers.find(u => u.email === user.email);
        if (entry) {
          if (entry.status === "Completed") completed++;
          if (entry.status === "In Progress") inProgress++;
          if (entry.status === "Failed") failed++;
          if (entry.seen) seen++;
        }
      });

      return {
        name: user.name,
        email: user.email,
        total: tasks.length,
        completed,
        inProgress,
        failed,
        seen,
        lastSeen: tasks.reduce((latest, task) => {
          const entry = task.assignedUsers.find(u => u.email === user.email);
          return entry?.seenAt > latest ? entry.seenAt : latest;
        }, null),
        lastCompleted: tasks.reduce((latest, task) => {
          const entry = task.assignedUsers.find(u => u.email === user.email);
          return entry?.completedAt > latest ? entry.completedAt : latest;
        }, null)
      };
    }));

    res.status(200).json(insights);
  } catch (err) {
    console.error("Error fetching mentor user insights:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Update Task Status (Per User)
export const completeTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { email, status, seen, submission } = req.body;

    if (!['Pending', 'In Progress', 'Completed', 'Failed'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const user = task.assignedUsers.find(u => u.email === email);
    if (!user) return res.status(404).json({ message: "User not assigned to this task" });

    // Update seen status if provided
    if (seen !== undefined) {
      user.seen = seen;
      user.seenAt = seen ? new Date() : null;
    }

    // Update task status
    user.status = status;
    if (status === 'Completed') {
      user.completedAt = new Date();
      if (submission) {
        user.submission = submission;
      }
    } else if (status === 'Failed') {
      user.completedAt = null;
    }

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    console.error("Update status error:", err.message);
    res.status(500).json({ message: "Failed to update task status" });
  }
};

// ✅ Update Task (including assigned users)
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updateData = req.body;

    // Get current task to preserve user statuses
    const currentTask = await Task.findById(taskId);
    if (!currentTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Create a map of existing user statuses
    const userStatusMap = new Map();
    currentTask.assignedUsers.forEach(user => {
      userStatusMap.set(user.email, {
        status: user.status,
        seen: user.seen,
        seenAt: user.seenAt,
        completedAt: user.completedAt
      });
    });

    // Convert `assignTo` to `assignedUsers` if present
    if (Array.isArray(updateData.assignTo)) {
      updateData.assignedUsers = updateData.assignTo.map(email => {
        // Preserve existing status if user was already assigned
        if (userStatusMap.has(email)) {
          return {
            email,
            ...userStatusMap.get(email)
          };
        }
        // New user gets default status
        return {
          email,
          status: 'Pending',
          seen: false,
          seenAt: null,
          completedAt: null
        };
      });
      delete updateData.assignTo;
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err.message);
    res.status(500).json({ message: "Failed to update task" });
  }
};

// ✅ Delete Task
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err.message);
    res.status(500).json({ message: "Failed to delete task" });
  }
};

// ✅ Add Query to Task
export const addQueryToTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { user, message } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const newQuery = {
      id: uuidv4(),
      user,
      message,
      createdAt: new Date()
    };

    task.queries.push(newQuery);
    await task.save();

    res.status(201).json(task.queries);
  } catch (err) {
    res.status(500).json({ message: "Failed to add query" });
  }
};

// ✅ Delete Query
export const deleteQuery = async (req, res) => {
  try {
    const { taskId, queryId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.queries = task.queries.filter(q => q.id !== queryId);
    await task.save();

    res.status(200).json(task.queries);
  } catch (err) {
    res.status(500).json({ message: "Failed to delete query" });
  }
};