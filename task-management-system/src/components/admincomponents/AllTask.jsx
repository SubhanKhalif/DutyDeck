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
    const interval = setInterval(fetchTasks, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus
      ? task.assignedUsers.some(user => user.status === filterStatus)
      : true;

    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.assignedUsers.some(user => user.email.toLowerCase().includes(search.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">All Tasks</h1>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base text-center px-2">This section displays all tasks assigned to employees.</p>

          <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 w-full sm:w-auto px-2">
            {['card', 'table'].map(type => (
              <button
                key={type}
                className={`flex-1 sm:flex-none px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold shadow transition text-sm sm:text-base ${
                  viewType === type 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-blue-600 border border-blue-600'
                }`}
                onClick={() => setViewType(type)}
              >
                {type === 'card' ? 'Card View' : 'Table View'}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-4 px-2 sm:px-0 mb-4 sm:mb-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search by task or user..."
                className="w-full pl-3 pr-3 py-2 rounded-md border border-blue-300 text-blue-700 bg-white shadow text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="w-full sm:w-32 px-2 py-2 rounded-md border border-blue-400 text-blue-700 bg-white shadow text-sm"
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
          <div className="px-2 sm:px-0">
            <TaskCard tasks={filteredTasks} onSelect={setSelectedTask} />
          </div>
        ) : (
          <div className="overflow-x-auto px-2 sm:px-0">
            <TaskTable tasks={filteredTasks} onSelect={setSelectedTask} />
          </div>
        )}

        {selectedTask && (
          <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} onTaskUpdate={fetchTasks} />
        )}
      </div>
    </div>
  );
};

export default AllTask;
