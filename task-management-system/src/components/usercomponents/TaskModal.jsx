import React from 'react'
import TaskQueryForm from './TaskQueryForm'
import TaskQueryList from './TaskQueryList'

const TaskModal = ({ task, onClose, onQueryAdd, onQueryDelete, user }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className={`relative w-full max-w-md mx-auto rounded-2xl shadow-2xl ${task.color} p-8 animate-pop`}>
        <button onClick={onClose} className="absolute top-3 right-3 text-xl font-bold text-gray-700 hover:text-red-600">&times;</button>
        <div className="flex items-center gap-3 mb-4">
          <h3 className={`${task.statusColor} text-xs px-3 py-1 rounded text-white font-semibold shadow`}>
            {task.userStatus}
          </h3>
          <h4 className="text-xs text-gray-600">{new Date(task.date).toLocaleDateString()}</h4>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{task.title}</h2>
        <p className="text-base text-gray-700">{task.description}</p>

        <div className="mt-4 border-t pt-4">
          <h4 className="text-lg font-bold text-gray-800 mb-2">Task Queries</h4>
          <TaskQueryForm taskId={task._id} user={user} onQueryAdd={onQueryAdd} />
          <TaskQueryList queries={task.queries} user={user} onQueryDelete={onQueryDelete} taskId={task._id} />
        </div>
      </div>
    </div>
  )
}

export default TaskModal
