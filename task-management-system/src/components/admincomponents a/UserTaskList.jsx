import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../../api';

const UserTaskList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
  const status = queryParams.get('status');

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const res = await API.get('/tasks/user-tasks', {
          params: { email, status }
        });
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch user tasks:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (email && status) {
      fetchUserTasks();
    }
  }, [email, status]);

  const formatDateTime = (date) => {
    if (!date) return 'Not available';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Tasks for {email} - <span className="capitalize">{status}</span>
      </h2>
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map(task => (
            <div key={task._id} className="bg-white p-4 shadow rounded-lg">
              <h3 className="text-lg font-bold text-blue-700">{task.title}</h3>
              <p className="text-sm text-gray-600 mb-1">{task.description}</p>
              <p className="text-xs text-gray-400">Due: {new Date(task.deadline).toLocaleDateString()}</p>
              <p className="text-xs text-gray-500 mt-1">Status: {task.userStatus}</p>
              <div className="mt-2 space-y-1">
                {task.userStatus === 'Completed' && (
                  <p className="text-xs text-gray-500">
                    Completed: {formatDateTime(task.completedAt)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTaskList;