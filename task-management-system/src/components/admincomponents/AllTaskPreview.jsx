import React, { useEffect, useState } from 'react';
import API from '../../api';
import TaskCard from './TaskCardPreview';
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
  }, []);

  const filteredTasks = tasks.filter(t => {
    const matchesStatus = filterStatus ? t.status === filterStatus : true;
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.assignTo.join(', ').toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">All Tasks</h1>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base text-center px-2">This section displays all tasks assigned to employees.</p>

          {/* View switch */}
          <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 w-full sm:w-auto justify-center">
            {['card', 'table'].map(type => (
              <button
                key={type}
                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-semibold shadow transition text-sm sm:text-base ${
                  viewType === type ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'
                }`}
                onClick={() => setViewType(type)}
              >
                {type === 'card' ? 'Card View' : 'Table View'}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row w-full max-w-3xl gap-2 sm:gap-4 sm:justify-between items-center mb-4 sm:mb-6 px-2 sm:px-0">
            <div className="relative w-full sm:w-2/3">
              <input
                type="text"
                placeholder="Search by task or user..."
                className="pl-9 pr-3 py-2 w-full rounded-md border border-blue-300 text-blue-700 bg-white shadow text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="w-full sm:w-28 px-2 py-2 rounded-md border border-blue-400 text-blue-700 bg-white shadow text-sm"
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
