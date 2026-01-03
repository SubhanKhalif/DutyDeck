import React, { useState, useEffect } from 'react';
import API from '../../api';
import { formatDistanceToNow } from 'date-fns';

const TaskQueries = ({ task, onTaskUpdate }) => {
  const [queries, setQueries] = useState(task.queries || []);
  const [error, setError] = useState(null);
  const [userNames, setUserNames] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Fetch all employees to get user names
    const fetchUserNames = async () => {
      try {
        const res = await API.get('/users/employees');
        const namesMap = res.data.reduce((acc, employee) => {
          acc[employee.email] = employee.name;
          return acc;
        }, {});
        setUserNames(namesMap);
      } catch (err) {
        console.error('Failed to fetch user names:', err);
      }
    };

    fetchUserNames();
  }, []);

  const handleAddQuery = async (e) => {
    e.preventDefault();
    const message = e.target.query.value.trim();
    if (!message) {
      setError('Query cannot be empty');
      return;
    }

    try {
      const res = await API.post(`/tasks/${task._id}/queries`, {
        user: user.email,
        message,
      });
      if (res.status === 201) {
        setQueries(res.data);
        e.target.reset();
        setError(null);
        onTaskUpdate();
      } else {
        throw new Error('Failed to add query');
      }
    } catch (err) {
      console.error('Add query failed:', err);
      setError(err.response?.data?.message || 'Failed to add query. Please try again.');
    }
  };

  const handleDeleteQuery = async (queryId) => {
    try {
      const res = await API.delete(`/tasks/${task._id}/queries/${queryId}`);
      if (res.status === 200) {
        setQueries(res.data);
        onTaskUpdate();
      } else {
        throw new Error('Failed to delete query');
      }
    } catch (err) {
      console.error('Delete query failed:', err);
      setError(err.response?.data?.message || 'Failed to delete query. Please try again.');
    }
  };

  // Function to convert URLs in text to clickable links
  const convertUrlsToLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  return (
    <div className="mt-6 w-full">
      <h4 className="text-lg font-bold text-gray-800 mb-4">Task Queries</h4>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 flex flex-col gap-2">
          <form onSubmit={handleAddQuery}>
            <textarea
              name="query"
              className="w-full p-3 border border-gray-300 rounded text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Type a query..."
              aria-label="Query input"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <button
              type="submit"
              className="mt-2 bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700 transition w-full md:w-fit"
            >
              Add Query
            </button>
          </form>
        </div>

        {/* Right Side: Query List */}
        <div
          className="w-full md:w-1/2 max-h-[320px] overflow-y-auto border border-gray-200 bg-white p-4 rounded-md shadow-inner"
          style={{
            scrollbarWidth: 'none',       // Firefox
            msOverflowStyle: 'none',      // IE/Edge
          }}
        >
          <style>
            {`
              ::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>

          {queries.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No queries added yet.</p>
          ) : (
            <ul className="space-y-3">
              {queries.map((q) => (
                <li
                  key={q.id}
                  className="bg-blue-50 border border-blue-200 px-5 py-4 rounded-lg shadow-sm hover:shadow-md transition max-w-full"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 break-words">
                        {convertUrlsToLinks(q.message)}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {userNames[q.user] || q.user} •{' '}
                        {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {q.user === user.email && (
                      <button
                        onClick={() => handleDeleteQuery(q.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-bold"
                        aria-label="Delete query"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskQueries;