import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const TaskPopup = ({ task, user, onClose, onDeleteQuery, onAddQuery }) => {
  const hasManyAssignees = task.assignedUsers.length > 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md relative animate-pop mx-2">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-3 md:right-3 text-xl font-bold text-gray-700 hover:text-red-600"
        >
          &times;
        </button>
        <div className="mb-3">
          <h3 className="text-lg md:text-xl font-bold text-blue-600">{task.title}</h3>
          <p className="text-xs md:text-sm text-gray-700">{task.description}</p>
          <p className="text-[10px] md:text-xs text-gray-500 mt-1">{new Date(task.date).toLocaleDateString()}</p>
        </div>
        <div className="mb-3">
          <h4 className="text-sm md:font-semibold text-gray-800">Assignees</h4>
          <ul className={`list-disc list-inside text-xs md:text-sm text-gray-700 ${hasManyAssignees ? 'max-h-24 md:max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100' : ''}`}>
            {task.assignedUsers.map((user, idx) => (
              <li key={idx} className="break-words">
                {user.email} - 
                <span className="ml-1 md:ml-2 text-[10px] md:text-xs px-1 md:px-2 py-0.5 md:py-1 rounded bg-gray-100 text-gray-800 font-medium">
                  {user.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Query section in a single row grid */}
        <div className="grid grid-cols-1 gap-3">
          <form
            onSubmit={onAddQuery}
            className="w-full"
          >
            <textarea
              name="query"
              className="w-full p-1 md:p-2 border rounded text-xs md:text-sm mb-1 md:mb-2"
              placeholder="Add your query..."
              rows="2"
            />
            <button type="submit" className="bg-blue-600 text-white px-2 md:px-3 py-0.5 md:py-1 rounded text-xs md:text-sm">
              Add Query
            </button>
          </form>
          <div className="w-full max-h-48 overflow-y-auto">
            {task.queries?.map(q => (
              <div key={q.id} className="bg-gray-100 p-2 md:p-3 rounded-lg mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs md:text-sm break-words">{q.message}</p>
                    <small className="text-gray-500 text-[10px] md:text-xs">
                      {q.user} • {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}
                    </small>
                  </div>
                  {q.user === user.email && (
                    <button 
                      onClick={() => onDeleteQuery(q.id)} 
                      className="text-red-600 text-xs hover:text-red-800 ml-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPopup;
