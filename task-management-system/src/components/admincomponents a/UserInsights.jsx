import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const UserInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await API.get('/tasks/user-insights');
        if (Array.isArray(res.data)) {
          setInsights(res.data);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        console.error("Failed to fetch user insights:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const handleStatusClick = (email, status) => {
    navigate(`/user-tasks?email=${encodeURIComponent(email)}&status=${encodeURIComponent(status)}`);
  };

  if (loading) return <div className="p-6 text-center">Loading insights...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 bg-white shadow rounded-xl max-w-6xl mx-auto my-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Task Insights</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border">
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Total</th>
              <th className="py-2 px-4 border">Completed</th>
              <th className="py-2 px-4 border">In Progress</th>
              <th className="py-2 px-4 border">Failed</th>
            </tr>
          </thead>
          <tbody>
            {insights.length > 0 ? (
              insights.map((user, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="py-2 px-4 border">{user.name}</td>
                  <td className="py-2 px-4 border">{user.email}</td>
                  <td className="py-2 px-4 border">
                    {user.total}
                  </td>
                  <td className="py-2 px-4 border text-green-600 cursor-pointer underline"
                      onClick={() => handleStatusClick(user.email, 'Completed')}>
                    {user.completed}
                  </td>
                  <td className="py-2 px-4 border text-blue-600 cursor-pointer underline"
                      onClick={() => handleStatusClick(user.email, 'In Progress')}>
                    {user.inProgress}
                  </td>
                  <td className="py-2 px-4 border text-red-600 cursor-pointer underline"
                      onClick={() => handleStatusClick(user.email, 'Failed')}>
                    {user.failed}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No user insights available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserInsights;