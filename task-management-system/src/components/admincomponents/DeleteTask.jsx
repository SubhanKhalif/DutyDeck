import React from 'react';
import API from '../../api';

const DeleteTask = ({ taskId, onClose, onTaskUpdate }) => {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      alert("Task deleted!");
      onTaskUpdate();
      onClose();
    } catch (err) {
      console.error("Delete task failed:", err.message);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full
                sm:w-auto sm:px-6 sm:py-3
                md:text-lg
                lg:hover:scale-105 lg:transition-transform"
    >
      🗑️ Delete Task
    </button>
  );
};

export default DeleteTask;
