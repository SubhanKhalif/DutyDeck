import React, { useEffect, useState } from 'react';
import API from '../../api';
import { CheckCircle, AlertCircle, Loader2, XCircle } from 'lucide-react';

const iconMap = {
  "New task": <AlertCircle className="w-8 h-8 text-red-500" />,
  "Completed task": <CheckCircle className="w-8 h-8 text-green-500" />,
  "In Progress": <Loader2 className="w-8 h-8 text-blue-500 animate-spin-slow" />,
  "Failed": <XCircle className="w-8 h-8 text-gray-600" />,
};

const gradientMap = {
  "New task": "from-red-400/30 via-red-300/20 to-red-200/10",
  "Completed task": "from-green-400/30 via-green-300/20 to-green-200/10",
  "In Progress": "from-blue-400/30 via-blue-300/20 to-blue-200/10",
  "Failed": "from-gray-600/30 via-gray-500/20 to-gray-400/10",
};

const Tasknumber = () => {
  const [stats, setStats] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Add a 1000ms delay before fetching
        await new Promise(resolve => setTimeout(resolve, 2000));
        const res = await API.get('/tasks/stats', {
          params: user.role === 'admin' ? {} : { email: user.email },
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load task stats:', err.message);
      }
    };
    fetchStats();
  }, []); // Removed user from dependencies to prevent auto-refresh

  const defaultStats = [
    { count: 0, label: "New task" },
    { count: 0, label: "Completed task" },
    { count: 0, label: "In Progress" },
    { count: 0, label: "Failed" },
  ];
  const displayStats = Array.isArray(stats) && stats.length > 0 ? stats : defaultStats;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          0%   { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-spin-slow {
          animation: spin 1.8s linear infinite;
        }
      `}</style>

      <div className="w-full flex flex-wrap justify-center gap-6 mt-12 px-4 sm:px-8">
        {displayStats.map((stat, idx) => {
          const gradient = gradientMap[stat.label] || "from-white/20 to-white/10";
          return (
            <div
              key={idx}
              className={`
                relative flex flex-col items-center justify-center
                bg-gradient-to-br ${gradient}
                border border-white/30
                rounded-2xl px-6 py-6 min-w-[120px] max-w-[200px]
                shadow-xl transition transform duration-300 ease-out
                hover:scale-105 hover:shadow-lg
                backdrop-blur-lg backdrop-brightness-110 text-gray-900 opacity-0 animate-fade-in
              `}
              style={{
                animationDelay: `${idx * 120}ms`,
                animationFillMode: 'forwards',
              }}
            >
              <div className="mb-2">{iconMap[stat.label]}</div>
              <h2 className="text-3xl font-extrabold">{stat.count}</h2>
              <h3 className="text-base font-medium text-center mt-1">{stat.label}</h3>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Tasknumber;