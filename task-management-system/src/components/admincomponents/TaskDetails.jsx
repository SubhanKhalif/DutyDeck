import React, { useState, useEffect } from 'react';
import statusColorMap from '../../utils/statusColors';
import API from '../../api';

const TaskDetails = ({ task, onEditToggle, onClose }) => {
  const isDeadlinePassed = task.deadline && new Date(task.deadline) < new Date();
  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await API.get('/users/employees');
        const details = res.data.reduce((acc, user) => {
          acc[user.email] = { name: user.name, organization: user.organization };
          return acc;
        }, {});
        setUserDetails(details);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      }
    };

    fetchUserDetails();
  }, []);

  const filteredUsers = task.assignedUsers?.filter(u => {
    const userDetail = userDetails[u.email];
    const nameMatch = userDetail?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || emailMatch;
  });

  const isUrl = (text) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <>
      <button onClick={onClose} className="absolute top-3 right-4 text-gray-700 text-xl font-bold hover:text-red-600">&times;</button>

      <div className="flex justify-between items-center">
        <h3 className={`text-xs px-3 py-1 rounded text-white font-semibold shadow ${task.statusColor}`}>{task.status}</h3>
        <button
          onClick={onEditToggle}
          className="text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          ✏️ Edit Task
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mt-3 mb-1">{task.title}</h2>
      <p className="text-gray-700 mb-4">{task.description}</p>

      <div className="mb-2">
        <p><strong>Category:</strong> {task.category}</p>
        <p><strong>Start Date:</strong> {new Date(task.date).toLocaleDateString()}</p>
        {task.deadline && (
          <p>
            <strong>Deadline:</strong>{" "}
            <span className={isDeadlinePassed && task.status !== 'Completed' ? "text-red-600 font-semibold" : ""}>
              {new Date(task.deadline).toLocaleDateString()}
            </span>
          </p>
        )}
      </div>

      <div className="mb-4 mt-2">
        <h4 className="font-semibold text-gray-800">Assigned to:</h4>
        <div className="flex justify-center">
          <button
            onClick={() => setShowAssignPopup(true)}
            className="bg-white text-blue-700 font-medium border border-gray-300 px-4 py-2 rounded-md shadow-sm hover:bg-blue-50 transition w-fit"
          >
            View Assigned Users
          </button>
        </div>

        {showAssignPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
               style={{
                 background: 'rgba(255, 255, 255, 0.08)',
                 backdropFilter: 'blur(12px)',
                 WebkitBackdropFilter: 'blur(12px)'
               }}>
            <div className="bg-white rounded-xl w-full max-w-3xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Assigned Users</h3>
                <button
                  className="text-gray-500 hover:text-red-600 text-2xl font-bold"
                  onClick={() => setShowAssignPopup(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>

              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                />
              </div>

              {/* User List */}
              <ul className="space-y-3">
  ` {filteredUsers?.length > 0 ? (
    filteredUsers.map((u, i) => (
      <li key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow transition duration-200">
        
        {/* Left Section */}
        <div className="w-full md:w-1/3">
          <p className="font-semibold text-gray-800 text-sm md:text-base">{userDetails[u.email]?.name || 'N/A'}</p>
          <p className="text-xs text-gray-600 break-all">Email: {u.email}</p>
          <p className="text-xs text-gray-600">Org: {userDetails[u.email]?.organization || 'N/A'}</p>
        </div>

        {/* Submission Section */}
        <div className="w-full md:w-1/3 mt-2 md:mt-0 text-sm text-gray-700 break-words text-left md:text-center">
          {u.submission ? (
            isUrl(u.submission) ? (
              <a
                href={u.submission}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800 break-all"
              >
                {u.submission}
              </a>
            ) : (
              <span className="text-gray-700 break-all">{u.submission}</span>
            )
          ) : (
            <span className="text-gray-400 italic">No submission</span>
          )}
        </div>

        {/* Status Section */}
        <div className="w-full md:w-1/3 mt-3 md:mt-0 flex md:justify-end">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusColorMap[u.status]}`}>
            {u.status}
          </span>
        </div>
      </li>
    ))
  ) : (
    <li className="text-center text-gray-500 py-2 text-sm">No users found</li>
  )}
</ul>

            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TaskDetails;
