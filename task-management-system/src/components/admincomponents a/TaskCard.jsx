import React, { useEffect, useState } from 'react';
import cardColors from '../../utils/taskColors';
import statusColorMap from '../../utils/statusColors';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const TaskCard = ({ onSelect }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    
    // Set up interval to refresh tasks every second
    const interval = setInterval(() => {
      fetchTasks();
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const cardTasks = tasks.slice(0, 8); // Only show first 8 tasks

  if (loading) {
    return <div className="col-span-full text-center text-gray-500 py-10">Loading tasks...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardTasks.length === 0 ? (
        <div className="col-span-full text-center text-gray-500 py-10">No tasks found.</div>
      ) : cardTasks.map((task, idx) => {
        const color = cardColors[idx % cardColors.length];
        const statusColor = statusColorMap[task.status] || 'bg-gray-400';
        const isDeadlinePassed = task.deadline && new Date(task.deadline) < new Date();
        const isAssignedToUser = task.assignedUsers.some(u => u.email === user?.email);
        
        return (
          <div
            key={task._id}
            onClick={() => onSelect({ ...task, color, statusColor })}
            className={`cursor-pointer rounded-xl p-5 shadow-lg transition transform hover:scale-105 ${color}`}
          >
            <div className="flex justify-between items-center">
              <h3 className={`text-xs px-3 py-1 rounded text-white font-semibold shadow ${statusColor}`}>
                {task.status}
              </h3>
              {isAssignedToUser && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Your Task
                </span>
              )}
              <span className="text-sm text-gray-700">{new Date(task.date).toLocaleDateString()}</span>
            </div>
            <h2 className="mt-3 text-xl font-bold text-gray-800">{task.title}</h2>
            <p className="text-sm text-gray-700 mt-2">{task.description}</p>
            {task.deadline && (
              <div className="mt-2">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Deadline: </span>
                  <span className={isDeadlinePassed ? "text-red-600 font-semibold" : ""}>
                    {new Date(task.deadline).toLocaleDateString()}
                  </span>
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Show All Card */}
      {tasks.length > 8 && (
        <div
          className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition"
          onClick={() => navigate('/all-tasks-preview')}
        >
          <h2 className="text-lg font-semibold text-blue-600">Show All</h2>
          <p className="text-sm text-gray-500 text-center mt-2">View all {tasks.length} tasks in detail</p>
        </div>
      )}
    </div>
  );
};

export default TaskCard;