import React, { useState } from 'react';
import TaskDetails from './TaskDetails';
import EditTask from './EditTask';
import DeleteTask from './DeleteTask';
import TaskQueries from './TaskQueries';

const TaskModal = ({ task, onClose, onTaskUpdate }) => {
  const [editMode, setEditMode] = useState(false);

  return (
    // 🧊 Outer transparent glassy background
    <div className="fixed inset-0 z-50 flex justify-center items-center p-2 sm:p-4 overflow-auto bg-white/10 backdrop-blur-[6px]">
      {/* 📦 Modal container (white box) with adjusted dimensions */}
      <div
        className={`relative w-full max-w-6xl max-h-[85vh] mx-auto rounded-2xl shadow-2xl flex flex-col md:flex-row transition-all duration-300 bg-white overflow-hidden`}
      >
        {/* 📄 Left/Main Section */}
        <div className={`w-full ${editMode ? 'md:w-1/2' : 'w-full'} p-4 sm:p-6 overflow-y-auto`}>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-blue-800 drop-shadow">Task Details</h2>

          </div>

          <TaskDetails task={task} onEditToggle={() => setEditMode(!editMode)} onClose={onClose} />

          {/* 🗂️ Task Queries */}
          <div className="mt-6">
            <TaskQueries
              task={task}
              onTaskUpdate={onTaskUpdate}
              gridClass="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            />
          </div>
        </div>

        {/* 🛠️ Right/Edit Section */}
        {editMode && (
          <div className="w-full md:w-1/2 bg-gradient-to-br from-white/90 via-gray-100/90 to-gray-200/90 p-4 sm:p-6 md:border-l border-blue-200 rounded-r-2xl flex flex-col overflow-y-auto">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-900">Edit Task</h3>
            <EditTask task={task} onClose={onClose} onTaskUpdate={onTaskUpdate} />
            <div className="mt-4">
              <DeleteTask taskId={task._id} onClose={onClose} onTaskUpdate={onTaskUpdate} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModal;