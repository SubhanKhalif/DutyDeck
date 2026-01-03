import React from 'react';

const TaskForm = ({
  title, setTitle,
  date, setDate,
  deadline, setDeadline,
  category, setCategory,
  description, setDescription,
  assignTo, setShowAssignPopup,
  onSubmit,
  error, success
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 md:flex-row">
      {/* Left Side: Main Fields */}
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Task Title</label>
          <input
            type="text"
            placeholder="Enter task title"
            className="w-full text-black outline-none border-2 border-gray-200 focus:border-blue-400 text-base py-2 px-4 rounded-md transition"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">Start Date</label>
            <input
              type="date"
              className="w-full text-black outline-none border-2 border-gray-200 focus:border-blue-400 text-base py-2 px-4 rounded-md transition"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">Deadline</label>
            <input
              type="date"
              className="w-full text-black outline-none border-2 border-gray-200 focus:border-blue-400 text-base py-2 px-4 rounded-md transition"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
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
            onChange={e => setCategory(e.target.value)}
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
          onChange={e => setDescription(e.target.value)}
        ></textarea>
      </div>
    </form>
  );
};

export default TaskForm;
