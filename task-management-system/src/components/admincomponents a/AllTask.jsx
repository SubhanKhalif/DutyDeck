import React, { useEffect, useState } from 'react';
import API from '../../api';
import TaskCard from './TaskCard';
import TaskTable from './TaskTable';
import TaskModal from './TaskModal';

const statusOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Completed", value: "Completed" },
  { label: "In Progress", value: "In Progress" }
];

const AllTask = () => {
  const [tasks, setTasks] = useState([]);
  const [viewType, setViewType] = useState('card');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
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

  const filteredTasks = tasks.filter(t => {
    const matchesStatus = filterStatus
      ? t.assignedUsers.some(user => user.status === filterStatus)
      : true;

    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.assignedUsers.some(user => user.email.toLowerCase().includes(search.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-2">All Tasks</h1>
          <p className="text-gray-600 mb-6">This section displays all tasks assigned to employees.</p>

          {/* View switch */}
          <div className="flex gap-4 mb-6">
            {['card', 'table'].map(type => (
              <button
                key={type}
                className={`px-4 py-2 rounded-lg font-semibold shadow transition ${viewType === type ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'}`}
                onClick={() => setViewType(type)}
              >
                {type === 'card' ? 'Card View' : 'Table View'}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex w-full max-w-3xl justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search by task or user..."
              className="pl-9 pr-3 py-2 w-2/3 rounded-md border border-blue-300 text-blue-700 bg-white shadow text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="w-28 px-2 py-2 rounded-md border border-blue-400 text-blue-700 bg-white shadow text-sm"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading tasks...</div>
        ) : viewType === 'card' ? (
          <TaskCard tasks={filteredTasks} onSelect={setSelectedTask} />
        ) : (
          <TaskTable tasks={filteredTasks} onSelect={setSelectedTask} />
        )}

        {selectedTask && (
          <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} onTaskUpdate={fetchTasks} />
        )}
      </div>
    </div>
  );
};

export default AllTask;
