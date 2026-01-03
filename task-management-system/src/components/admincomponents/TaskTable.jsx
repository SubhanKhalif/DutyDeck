import React from 'react';
import statusColorMap from '../../utils/statusColors';

const TaskTable = ({ tasks, onSelect }) => {
  return (
    <div className="overflow-x-auto mt-6 rounded-xl shadow bg-white border border-gray-200">
      <div className="min-w-[300px]">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {['Title', 'Description', 'Date', 'Category', 'Assignees', 'Status'].map((h, i) => (
                <th key={i} className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-10">No tasks found.</td>
              </tr>
            ) : tasks.map((t, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelect(t)}
              >
                <td className="px-3 sm:px-6 py-4 text-sm text-gray-800 break-words max-w-[150px]">{t.title}</td>
                <td className="px-3 sm:px-6 py-4 text-sm text-gray-600 break-words max-w-[200px]">{t.description}</td>
                <td className="px-3 sm:px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                  {new Date(t.date).toLocaleDateString()}
                </td>
                <td className="px-3 sm:px-6 py-4 text-sm text-gray-600">{t.category}</td>
                <td className="px-3 sm:px-6 py-4 text-sm">
                  <ul className="space-y-1">
                    {t.assignedUsers?.map((user, i) => (
                      <li key={i} className="flex items-center gap-2 flex-wrap">
                        <span className="break-all">{user.email}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs text-white ${statusColorMap[user.status]}`}>
                          {user.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-3 sm:px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold shadow ${statusColorMap[t.status || 'Pending']}`}>
                    {t.assignedUsers?.some(u => u.status === 'In Progress') ? 'In Progress' :
                     t.assignedUsers?.every(u => u.status === 'Completed') ? 'Completed' :
                     'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
