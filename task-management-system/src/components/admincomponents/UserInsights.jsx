import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import API from '../../api';

const sortOptions = [
  { label: "Name", value: "name" },
  { label: "Total Tasks", value: "total" },
  { label: "Completed", value: "completed" },
];

const UserInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
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

  // Sorting logic
  const sortedInsights = [...insights].sort((a, b) => {
    let cmp = 0;
    switch (sortBy) {
      case "name":
        cmp = a.name.localeCompare(b.name);
        break;
      case "total":
        cmp = a.total - b.total;
        break;
      case "completed":
        cmp = a.completed - b.completed;
        break;
      default:
        cmp = 0;
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  if (loading) return <div className="p-6 text-center">Loading insights...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4 sm:p-6 bg-white shadow rounded-xl w-full mx-auto my-4 sm:my-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">User Task Insights</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-by" className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            id="sort-by"
            className="border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            className="ml-2 p-1 rounded border border-blue-200 bg-blue-50 hover:bg-blue-100 transition"
            onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
            title={sortDir === "asc" ? "Ascending" : "Descending"}
            aria-label="Toggle sort direction"
            type="button"
          >
            {sortDir === "asc" ? (
              <FaArrowUp className="inline text-blue-600" />
            ) : (
              <FaArrowDown className="inline text-blue-600" />
            )}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              <th className="py-2 px-2 sm:px-4 border">S.No.</th>
              <th className="py-2 px-2 sm:px-4 border">Name</th>
              <th className="py-2 px-2 sm:px-4 border hidden sm:table-cell">Email</th>
              <th className="py-2 px-2 sm:px-4 border">Total</th>
              <th className="py-2 px-2 sm:px-4 border">Done</th>
              <th className="py-2 px-2 sm:px-4 border">In Prog</th>
              <th className="py-2 px-2 sm:px-4 border">Failed</th>
            </tr>
          </thead>
          <tbody>
            {sortedInsights.length > 0 ? (
              sortedInsights.map((user, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="py-2 px-2 sm:px-4 border text-center">{idx + 1}</td>
                  <td className="py-2 px-2 sm:px-4 border">{user.name}</td>
                  <td className="py-2 px-2 sm:px-4 border hidden sm:table-cell">{user.email}</td>
                  <td className="py-2 px-2 sm:px-4 border">{user.total}</td>
                  <td className="py-2 px-2 sm:px-4 border text-green-600 cursor-pointer underline"
                      onClick={() => handleStatusClick(user.email, 'Completed')}>
                    {user.completed}
                  </td>
                  <td className="py-2 px-2 sm:px-4 border text-blue-600 cursor-pointer underline"
                      onClick={() => handleStatusClick(user.email, 'In Progress')}>
                    {user.inProgress}
                  </td>
                  <td className="py-2 px-2 sm:px-4 border text-red-600 cursor-pointer underline"
                      onClick={() => handleStatusClick(user.email, 'Failed')}>
                    {user.failed}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
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