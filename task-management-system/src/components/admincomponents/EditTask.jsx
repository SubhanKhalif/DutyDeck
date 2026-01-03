import React, { useEffect, useState } from 'react';
import API from '../../api';

const EditTask = ({ task, onClose, onTaskUpdate }) => {
  const [employees, setEmployees] = useState([]);
  const [orgFilter, setOrgFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignPopup, setShowAssignPopup] = useState(false);

  const [form, setForm] = useState({
    title: task.title,
    description: task.description,
    category: task.category,
    date: task.date?.split('T')[0] || '',
    deadline: task.deadline?.split('T')[0] || '',
    assignedUsers: task.assignedUsers?.map(u => u.email) || [],
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get("/users/employees");
        setEmployees(res.data);
      } catch (err) {
        console.error("Failed to fetch employees", err.message);
      }
    };
    fetchEmployees();
  }, []);

  const handleAssignChange = (email) => {
    setForm(prev => ({
      ...prev,
      assignedUsers: prev.assignedUsers.includes(email)
        ? prev.assignedUsers.filter(u => u !== email)
        : [...prev.assignedUsers, email]
    }));
  };

  const getFilteredEmployees = () => {
    return employees.filter(emp => {
      const matchesOrg = !orgFilter || emp.organization === orgFilter;
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesOrg && matchesSearch;
    });
  };

  const filteredEmployees = getFilteredEmployees();
  const filteredEmployeeEmails = filteredEmployees.map(emp => emp.email);
  const isAllSelected = form.assignedUsers.length === filteredEmployeeEmails.length && filteredEmployeeEmails.length > 0;

  const handleSelectAll = () => {
    setForm(prev => ({
      ...prev,
      assignedUsers: isAllSelected ? [] : filteredEmployeeEmails
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const assignedUsers = form.assignedUsers.map(email => {
        // Find existing user status if it exists
        const existingUser = task.assignedUsers?.find(u => u.email === email);
        return {
          email,
          status: existingUser?.status || 'Pending',
          seen: existingUser?.seen || false,
          seenAt: existingUser?.seenAt || null,
          completedAt: existingUser?.completedAt || null
        };
      });

      const payload = {
        ...form,
        assignedUsers
      };

      await API.put(`/tasks/${task._id}`, payload);
      alert("Task updated!");
      onTaskUpdate();
      onClose();
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-3">
      <input
        name="title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="Title"
        className="w-full p-2 border rounded"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Description"
        className="w-full p-2 border rounded"
      />
      <input
        name="category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        placeholder="Category"
        className="w-full p-2 border rounded"
      />
      <input
        name="date"
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        name="deadline"
        type="date"
        value={form.deadline}
        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        className="w-full p-2 border rounded"
      />

      <div>
        <label className="block font-medium text-gray-7 00 mb-1">Assign To:</label>
        <button
          type="button"
          className="w-full bg-white border-2 border-gray-200 text-black rounded-md py-2 px-4 transition hover:bg-blue-50"
          onClick={() => setShowAssignPopup(true)}
        >
          {form.assignedUsers.length === 0 ? 'Select employees' : `${form.assignedUsers.length} selected`}
        </button>
      </div>

      <div className="flex justify-between items-center pt-4 gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Close</button>
      </div>

      {/* Assign Popup */}
      {showAssignPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div
            className="bg-white rounded-xl p-4 sm:p-6 md:p-8 w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            style={{
              width: "100%",
              maxWidth: "min(90vw, 900px)",
              minWidth: "min(90vw, 320px)",
              transition: "all 0.2s ease"
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Select Employees</h3>
              <button
                onClick={() => setShowAssignPopup(false)}
                className="text-gray-500 hover:text-red-600 text-xl sm:text-2xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex flex-col sm:flex-row items-center justify-end gap-2">
                <label htmlFor="org-filter" className="text-blue-900 font-medium">Filter by Organization:</label>
                <select
                  id="org-filter"
                  className="border border-blue-300 rounded-lg px-3 py-2 text-blue-900 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full sm:w-auto"
                  value={orgFilter}
                  onChange={e => setOrgFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {[...new Set(employees.map(emp => emp.organization).filter(Boolean))].map(org => (
                    <option key={org} value={org}>{org}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-blue-900 font-medium cursor-pointer">
                <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
                Select All
              </label>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto"
              style={{
                minHeight: employees.length === 0 ? "3rem" : undefined
              }}
            >
              {filteredEmployees.length === 0 ? (
                <div className="col-span-full text-gray-500 text-center">No employees found.</div>
              ) : (
                filteredEmployees.map((emp, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 cursor-pointer border border-blue-200 hover:bg-blue-100 transition"
                  >
                    <input
                      type="checkbox"
                      checked={form.assignedUsers.includes(emp.email)}
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
    </form>
  );
};

export default EditTask;