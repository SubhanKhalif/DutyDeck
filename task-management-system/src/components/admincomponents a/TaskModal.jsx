import React, { useState, useEffect } from 'react';
import API from '../../api';
import { formatDistanceToNow } from 'date-fns';
import statusColorMap from '../../utils/statusColors';

const TaskModal = ({ task, onClose, onTaskUpdate }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [queries, setQueries] = useState(task.queries || []);
  const [editMode, setEditMode] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    title: task.title,
    description: task.description,
    category: task.category,
    date: task.date?.split('T')[0] || '',
    deadline: task.deadline?.split('T')[0] || '',
    assignedUsers: task.assignedUsers?.map(u => u.email) || [],
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get("/users/employees");
        setEmployees(res.data);
      } catch (err) {
        console.error("Failed to fetch employees", err.message);
      }
    };
    if (editMode) fetchEmployees();
  }, [editMode]);

  const handleAddQuery = async (e) => {
    e.preventDefault();
    const message = e.target.query.value.trim();
    if (!message) return;
    try {
      const res = await API.post(`/tasks/${task._id}/queries`, {
        user: user.email,
        message
      });
      setQueries(res.data);
      e.target.reset();
      onTaskUpdate();
    } catch (err) {
      console.error("Add query failed", err.message);
    }
  };

  const handleDeleteQuery = async (queryId) => {
    try {
      const res = await API.delete(`/tasks/${task._id}/queries/${queryId}`);
      setQueries(res.data);
      onTaskUpdate();
    } catch (err) {
      console.error("Delete query failed", err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const assignedUsers = form.assignedUsers.map(email => ({
        email,
        status: 'Pending',
        seen: false,
        seenAt: null,
        completedAt: null
      }));

      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        date: form.date,
        deadline: form.deadline,
        assignedUsers
      };

      await API.put(`/tasks/${task._id}`, payload);
      alert("Task updated!");
      setEditMode(false);
      onTaskUpdate();
      onClose();
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  const handleDeleteTask = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/tasks/${task._id}`);
      alert("Task deleted!");
      onTaskUpdate();
      onClose();
    } catch (err) {
      console.error("Delete task failed:", err.message);
    }
  };

  const toggleAssign = (email) => {
    setForm(prev => ({
      ...prev,
      assignedUsers: prev.assignedUsers.includes(email)
        ? prev.assignedUsers.filter(u => u !== email)
        : [...prev.assignedUsers, email]
    }));
  };

  // Determine if deadline passed and if task is completed
  const isDeadlinePassed = task.deadline && new Date(task.deadline) < new Date();
  const isCompleted = task.assignedUsers?.some(u => u.email === user.email && u.status === 'Completed');

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center p-4 overflow-auto">
      <div className={`relative w-full max-w-5xl bg-white rounded-2xl shadow-xl flex transition-all duration-300 ${editMode ? "flex-row" : "justify-center"}`}>

        {/* Left Side */}
        <div className={`w-full ${editMode ? 'md:w-1/2' : 'max-w-xl'} p-6 ${task.color || 'bg-white'}`}>
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-700 text-xl font-bold hover:text-red-600"
          >&times;</button>

          <div className="flex justify-between items-center">
            <h3 className={`text-xs px-3 py-1 rounded text-white font-semibold shadow ${task.statusColor}`}>
              {task.status}
            </h3>
            <button
              onClick={() => setEditMode(!editMode)}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              ✏️ Edit Task
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mt-3 mb-1">{task.title}</h2>
          <p className="text-gray-700 mb-4">{task.description}</p>

          <div className="mb-2">
            <p><strong>Category:</strong> {task.category}</p>
            <p><strong>Start Date:</strong> {new Date(task.date).toLocaleDateString()}</p>
            {task.deadline && (
              <p>
                <strong>Deadline:</strong>{" "}
                <span className={isDeadlinePassed && task.status !== 'Completed' ? "text-red-600 font-semibold" : ""}>
                  {new Date(task.deadline).toLocaleDateString()}
                </span>
              </p>
            )}
          </div>

          <div className="mb-4 mt-2">
            <h4 className="font-semibold text-gray-800">Assigned to:</h4>
            <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
              {task.assignedUsers?.map((u, i) => (
                <li key={i}>
                  {u.email}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs text-white ${statusColorMap[u.status]}`}>
                    {u.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="text-lg font-bold text-gray-800 mb-2">Task Queries</h4>
            <form onSubmit={handleAddQuery}>
              <textarea name="query" className="w-full p-2 border rounded text-sm mb-2" placeholder="Type a query..." />
              <button className="bg-blue-600 text-white px-3 py-1 text-sm rounded">Add Query</button>
            </form>

            <ul className="mt-4 space-y-2 max-h-48 overflow-y-auto">
              {queries.map(q => (
                <li key={q.id} className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-800">{q.message}</p>
                      <small className="text-xs text-gray-500">
                        {q.user} • {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}
                      </small>
                    </div>
                    {q.user === user.email && (
                      <button
                        onClick={() => handleDeleteQuery(q.id)}
                        className="text-xs text-red-600 hover:text-red-700 ml-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Right Side – Edit Form */}
        {editMode && (
          <div className="w-full md:w-1/2 bg-gray-100 p-6 border-l border-gray-300">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit Task</h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                name="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Title"
                className="w-full p-2 border rounded"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
                className="w-full p-2 border rounded"
              />
              <input
                name="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Category"
                className="w-full p-2 border rounded"
              />
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full p-2 border rounded"
              />

              <div>
                <label className="block font-medium text-gray-700 mb-1">Assign To:</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {employees.map((emp, i) => (
                    <label key={i} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.assignedUsers.includes(emp.email)}
                        onChange={() => toggleAssign(emp.email)}
                      />
                      {emp.name} ({emp.email})
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Save Changes
                </button>
                <button type="button" className="text-gray-600 hover:text-gray-800" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </div>

              <button
                type="button"
                onClick={handleDeleteTask}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full"
              >
                🗑️ Delete Task
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
