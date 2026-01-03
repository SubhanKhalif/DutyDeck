import React from 'react';

const AssignPopup = ({
  show,
  onClose,
  employees,
  assignTo,
  setAssignTo,
  orgFilter,
  setOrgFilter
}) => {
  const filtered = employees.filter(emp => !orgFilter || emp.organization === orgFilter);
  const allEmails = filtered.map(e => e.email);
  const isAllSelected = assignTo.length === allEmails.length && allEmails.length > 0;

  const toggleAssign = email => {
    setAssignTo(prev =>
      prev.includes(email) ? prev.filter(u => u !== email) : [...prev, email]
    );
  };

  const handleSelectAll = () => {
    setAssignTo(isAllSelected ? [] : allEmails);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.15)" }}>
      <div
        className="bg-white rounded-xl p-4 sm:p-6 md:p-8 w-full shadow-2xl relative"
        style={{
          width: "100%",
          maxWidth: "min(90vw, 900px)",
          minWidth: "280px",
          transition: "max-width 0.2s",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
      >
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-800">Select Employees</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-xl sm:text-2xl font-bold"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 sm:mb-4">
          <label className="flex items-center gap-2 text-blue-900 text-sm sm:text-base font-medium cursor-pointer">
            <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
            Select All
          </label>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <label htmlFor="org-filter" className="text-blue-900 text-sm sm:text-base font-medium">Filter by Organization:</label>
            <select
              id="org-filter"
              className="w-full sm:w-auto border border-blue-300 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-blue-900 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm sm:text-base"
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

        <div
          className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4"
          style={{
            minHeight: filtered.length === 0 ? "3rem" : undefined,
            maxHeight: "60vh",
            overflowY: "auto"
          }}
        >
          {filtered.length === 0 ? (
            <div className="col-span-full text-gray-500 text-sm sm:text-base text-center">No employees found.</div>
          ) : (
            filtered.map((emp, idx) => (
              <label
                key={idx}
                className="flex items-center gap-2 bg-blue-50 rounded-lg px-2 sm:px-3 py-1 sm:py-2 cursor-pointer border border-blue-200 hover:bg-blue-100 transition"
              >
                <input
                  type="checkbox"
                  checked={assignTo.includes(emp.email)}
                  onChange={() => toggleAssign(emp.email)}
                />
                <span className="text-blue-900 text-sm sm:text-base font-medium">{emp.name} ({emp.organization})</span>
              </label>
            ))
          )}
        </div>

        <div className="flex justify-end mt-4 sm:mt-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-6 py-1 sm:py-2 rounded-lg shadow transition text-sm sm:text-base"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignPopup;