import React from 'react'

const TaskCard = ({ task, idx, onClick, onStatusCycle }) => {
  const isDeadlinePassed = task.deadline && new Date(task.deadline) < new Date()

  return (
    <div
      key={task._id}
      onClick={onClick}
      className={`relative w-full cursor-pointer shadow-xl rounded-2xl transition-all duration-300 ${task.color}
        ${idx !== 0 ? '-mt-16' : ''} hover:scale-105 sm:mt-0 sm:w-full`}
      style={{
        zIndex: 100 - idx,
        boxShadow: '0 8px 24px rgba(0,0,0,0.08), 0 1.5px 4px rgba(0,0,0,0.08)'
      }}
    >
      <div className='flex items-center justify-between px-6 pt-6'>
        <h3 className={`${task.statusColor} text-xs px-3 py-1 rounded text-white font-semibold shadow`}>
          {task.userStatus}
        </h3>
        <h4 className="text-xs text-gray-600">{new Date(task.date).toLocaleDateString()}</h4>
      </div>
      <div className="px-6 pb-6">
        <h2 className="mt-4 text-xl font-bold text-gray-800">{task.title}</h2>
        <p className="text-sm text-gray-600 mt-2">{task.description}</p>
        {task.deadline && (
          <p className="text-sm text-gray-700 mt-2">
            Deadline:{' '}
            <span className={isDeadlinePassed && task.userStatus !== 'Completed' ? "text-red-600 font-semibold" : ""}>
              {new Date(task.deadline).toLocaleDateString()}
            </span>
          </p>
        )}
        <button
          className="mt-2 bg-white text-gray-900 font-medium text-xs px-3 py-1 rounded shadow hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation()
            onStatusCycle()
          }}
        >
          Mark as {task.userStatus === "Pending" ? "In Progress" : task.userStatus === "In Progress" ? "Completed" : "Pending"}
        </button>
      </div>
    </div>
  )
}

export default TaskCard
