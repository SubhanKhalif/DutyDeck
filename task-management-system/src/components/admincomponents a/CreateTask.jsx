import React, { useState, useEffect } from 'react';
import API from '../../api';

const CreateTask = () => {
  const [employees, setEmployees] = useState([]);
  const [orgFilter, setOrgFilter] = useState('');

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignTo, setAssignTo] = useState([]);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showAssignPopup, setShowAssignPopup] = useState(false);

  // Fetch employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get('/users/employees');
        setEmployees(res.data);
      } catch (err) {
        console.error('Failed to fetch employees:', err.message);
        setError('Failed to load employee list.');
      }
    };

    fetchEmployees();
  }, []);

  const handleCreate = async (taskData) => {
    try {
        const res = await API.post('/tasks', taskData);
        setSuccess(res.data.message);
        setError('');
        setTitle('');
        setDate('');
        setDeadline('');
        setAssignTo([]);
        setCategory('');
        setDescription('');
    } catch (err) {
        setError(err.response?.data?.message || err.message);
        setSuccess('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !date || !deadline || assignTo.length === 0 || !category || !description) {
        setError('All fields are required.');
        return;
    }

    // Keep assignTo as array of strings - backend will transform it
    const newTask = {
        title,
        date,
        deadline,
        assignTo, // This remains as array of emails
        category,
        description,
        status: 'Pending',
    };

    handleCreate(newTask);
  };

  const handleAssignChange = (email) => {
    setAssignTo((prev) =>
        prev.includes(email) ? prev.filter((u) => u !== email) : [...prev, email]
    );
  };

  const allEmployeeKeys = employees.map(emp => emp.email);
  const isAllSelected = assignTo.length === allEmployeeKeys.length && allEmployeeKeys.length > 0;

  const handleSelectAll = () => {
    setAssignTo(isAllSelected ? [] : allEmployeeKeys);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h2>
        <p className="text-gray-600 mb-8">Welcome to the admin dashboard. Here you can manage users, view reports, and assign tasks.</p>
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Create Task</h2>
          <form className="flex flex-col gap-6 md:flex-row" onSubmit={handleSubmit}>
            {/* Left Side: Main Fields */}
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  className="w-full text-black outline-none border-2 border-gray-200 focus:border-blue-400 text-base py-2 px-4 rounded-md transition"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full text-black outline-none border-2 border-gray-200 focus:border-blue-400 text-base py-2 px-4 rounded-md transition"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">Deadline</label>
                  <input
                    type="date"
                    className="w-full text-black outline-none border-2 border-gray-200 focus:border-blue-400 text-base py-2 px-4 rounded-md transition"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Assign to</label>
                <button
                  type="button"
                  className="w-full bg-white border-2 border-gray-200 text-black rounded-md py-2 px-4 transition hover:bg-blue-50"
                  onClick={() => setShowAssignPopup(true)}
                >
                  {assignTo.length === 0 ? 'Select employees' : `${assignTo.length} selected`}
                </button>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Category</label>
                <input
                  type="text"
                  placeholder="Enter task category"
                  className="w-full text-black outline-none border-2 border-gray-200 focus:border-blue-400 text-base py-2 px-4 rounded-md transition"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="mt-2 bg-blue-500 hover:bg-blue-600 transition text-white text-lg font-semibold px-6 py-2 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Create Task
              </button>

              {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
              {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
            </div>

            {/* Right Side: Description */}
            <div className="flex-1 flex flex-col gap-2 md:pl-6 mt-6 md:mt-0">
              <label className="block text-gray-700 font-medium mb-1">Task Description</label>
              <textarea
                placeholder="Enter task description"
                className="w-full h-40 md:h-full text-black outline-none border-2 border-gray-200 focus:border-blue-400 text-base py-2 px-4 rounded-md transition resize-none"
                rows="8"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </form>
        </div>
      </div>

      {/* Assign To Popup */}
      {showAssignPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.15)" }}>
          <div
            className="bg-white rounded-xl p-8 w-full shadow-2xl relative"
            style={{
              width: "100%",
              maxWidth:
                employees.length <= 6
                  ? "400px"
                  : employees.length <= 12
                  ? "600px"
                  : "900px",
              minWidth: "320px",
              transition: "max-width 0.2s"
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Select Employees</h3>
              <button
                className="text-gray-500 hover:text-red-600 text-2xl font-bold"
                onClick={() => setShowAssignPopup(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Organization Filter */}
            <div className="flex items-center justify-end mb-4">
              <label htmlFor="org-filter" className="mr-2 text-blue-900 font-medium">Filter by Organization:</label>
              <select
                id="org-filter"
                className="border border-blue-300 rounded-lg px-3 py-2 text-blue-900 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={orgFilter}
                onChange={e => setOrgFilter(e.target.value)}
              >
                <option value="">All</option>
                {[...new Set(employees.map(emp => emp.organization).filter(Boolean))].map(org => (
                  <option key={org} value={org}>{org}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-blue-900 font-medium cursor-pointer">
                <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
                Select All
              </label>
            </div>

            <div
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-72 overflow-y-auto"
              style={{
                minHeight: employees.length === 0 ? "3rem" : undefined,
                maxHeight: "18rem"
              }}
            >
              {(employees.filter(emp => !orgFilter || emp.organization === orgFilter)).length === 0 ? (
                <div className="col-span-full text-gray-500 text-center">No employees found.</div>
              ) : (
                employees
                  .filter(emp => !orgFilter || emp.organization === orgFilter)
                  .map((emp, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 cursor-pointer border border-blue-200 hover:bg-blue-100 transition"
                    >
                      <input
                        type="checkbox"
                        checked={assignTo.includes(emp.email)}
                        onChange={() => handleAssignChange(emp.email)}
                      />
                      <span className="text-blue-900 font-medium">{emp.name} ({emp.organization})</span>
                    </label>
                  ))
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
                onClick={() => setShowAssignPopup(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTask;