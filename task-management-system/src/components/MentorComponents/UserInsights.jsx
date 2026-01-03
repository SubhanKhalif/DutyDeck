import { useEffect, useState } from "react";
import API from "../../api"; // adjust the path if needed

export default function MentorInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const res = await API.get("/tasks/mentor-user-insights");
        
        if (Array.isArray(res.data)) {
          setInsights(res.data);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        console.error("Error fetching mentor insights:", err);
        setError(err.response?.data?.message || err.message || "Failed to load insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-blue-700">Assigned User Insights</h2>

      {loading && <p className="text-gray-600">Loading insights...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && insights.length === 0 && !error && (
        <p className="text-gray-500">No insights found.</p>
      )}

      {!loading && insights.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((user, idx) => (
            <div key={idx} className="bg-white rounded shadow p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{user.email}</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>Total Tasks: {user.total}</li>
                <li>Completed: {user.completed}</li>
                <li>In Progress: {user.inProgress}</li>
                <li>Failed: {user.failed}</li>
                <li>Seen: {user.seen}</li>
                {user.lastSeen && (
                  <li>
                    Last Seen: {new Date(user.lastSeen).toLocaleString()}
                  </li>
                )}
                {user.lastCompleted && (
                  <li>
                    Last Completed: {new Date(user.lastCompleted).toLocaleString()}
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
