import React from 'react';
import cardColors from '../../utils/taskColors';
import statusColorMap from '../../utils/statusColors';

const TaskCard = ({ tasks, onSelect }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.length === 0 ? (
        <div className="col-span-full text-center text-gray-500 py-10">No tasks found.</div>
      ) : tasks.map((task, idx) => {
        const color = cardColors[idx % cardColors.length];
        const statusColor = statusColorMap[task.status] || 'bg-gray-400';
        const isDeadlinePassed = task.deadline && new Date(task.deadline) < new Date();
        const isAssignedToUser = task.assignedUsers.some(u => u.email === user?.email);
        const hasManyAssignees = task.assignedUsers.length > 5;

        return (
          <div
            key={task._id}
            onClick={() => onSelect({ ...task, color, statusColor })}
            className={`cursor-pointer rounded-xl p-5 shadow-lg transition transform hover:scale-105 ${color}`}
          >
            <div className="flex justify-between items-center">
              <h3 className={`text-xs px-3 py-1 rounded text-white font-semibold shadow ${statusColor}`}>
                {task.status}
              </h3>
              {isAssignedToUser && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Your Task
                </span>
              )}
              <span className="text-sm text-gray-700">{new Date(task.date).toLocaleDateString()}</span>
            </div>
            <h2 className="mt-3 text-xl font-bold text-gray-800">{task.title}</h2>
            <p className="text-sm text-gray-700 mt-2">{task.description}</p>

            <div className="mt-3">
              <p className="font-medium text-gray-700">Assigned To:</p>
              <div className={`${hasManyAssignees ? 'max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100' : ''} rounded`}>
                <ul className="text-sm text-gray-800 mt-1 space-y-1 pr-2">
                  {task.assignedUsers.map((user, i) => (
                    <li key={i} className="flex justify-between items-center border-b pb-1">
                      <span>{user.name}</span>
                      <span
                        className={`
                          text-xs font-semibold px-2 py-1 rounded
                          ${user.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            user.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            user.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'}
                        `}
                      >
                        {user.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {task.deadline && (
              <div className="mt-2">
                <p className="text-sm text-gray-700">
                  Deadline: {' '}
                  <span className={isDeadlinePassed && task.status !== 'Completed' ? "text-red-600 font-semibold" : ""}>
                    {new Date(task.deadline).toLocaleDateString()}
                  </span>
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TaskCard;