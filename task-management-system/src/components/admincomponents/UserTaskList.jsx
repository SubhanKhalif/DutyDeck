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

  const isUrl = (text) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 md:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800 break-words">
        Tasks for {email} - <span className="capitalize">{status}</span>
      </h2>
      {loading ? (
        <p className="text-center p-4">Loading tasks...</p>
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tasks.map(task => (
            <div key={task._id} className="bg-white p-3 sm:p-4 shadow rounded-lg hover:shadow-md transition-shadow">
              <h3 className="text-base sm:text-lg font-bold text-blue-700 break-words">{task.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 break-words">{task.description}</p>
              <p className="text-[10px] sm:text-xs text-gray-400">Due: {new Date(task.deadline).toLocaleDateString()}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Status: {task.userStatus}</p>
              <div className="mt-2 space-y-1">
                {task.userStatus === 'Completed' && (
                  <>
                    <p className="text-[10px] sm:text-xs text-gray-500 break-words">
                      Completed: {formatDateTime(task.completedAt)}
                    </p>
                    {task.submission && (
                      <p className="text-[10px] sm:text-xs text-gray-500 break-words">
                        Submission: {isUrl(task.submission) ? (
                          <a 
                            href={task.submission} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {task.submission}
                          </a>
                        ) : (
                          <span>{task.submission}</span>
                        )}
                      </p>
                    )}
                  </>
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