import React, { useEffect, useState } from 'react';
import API from '../../api';

const Tasknumber = () => {
  const [stats, setStats] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/tasks/stats', {
          params: user.role === 'admin' ? {} : { email: user.email }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load task stats:', err.message);
      }
    };

    fetchStats();
  }, [user]);

  const defaultStats = [
    { count: 0, label: "New task", bg: "bg-red-500", text: "text-white" },
    { count: 0, label: "Completed task", bg: "bg-green-300", text: "text-gray-900" },
    { count: 0, label: "In Progress", bg: "bg-blue-500", text: "text-white" },
    { count: 0, label: "Failed", bg: "bg-gray-600", text: "text-white" }
  ];

  const displayStats = Array.isArray(stats) && stats.length > 0 ? stats : defaultStats;

  return (
    <div className="w-full flex flex-wrap justify-center gap-4 mt-10 bg-gray-800 p-4 rounded-lg shadow-md">
      {displayStats.map((stat, idx) => (
        <div
          key={idx}
          className={`
            flex flex-col items-center justify-between
            ${stat.bg} ${stat.text}
            rounded-xl py-4 px-4 min-w-[110px] max-w-[44%]
            shadow transition-transform hover:scale-105
            sm:min-w-[140px] sm:max-w-[200px] sm:px-6 sm:py-6
          `}
          style={{ flex: '1 1 40%' }}
        >
          <h2 className="text-2xl sm:text-3xl font-semibold">{stat.count}</h2>
          <h3 className="text-base sm:text-xl font-medium text-center">{stat.label}</h3>
        </div>
      ))}
    </div>
  );
};

export default Tasknumber;
