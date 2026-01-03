import React, { useState, useEffect } from 'react'
import API from '../../api'
import { formatDistanceToNow } from 'date-fns'

const cardColors = [
  "bg-yellow-300", "bg-blue-200", "bg-green-200",
  "bg-pink-200", "bg-purple-200", "bg-orange-200",
  "bg-teal-200", "bg-indigo-200"
]

const statusColorMap = {
  "Pending": "bg-red-600",
  "To Do": "bg-yellow-600",
  "Completed": "bg-green-600",
  "In Progress": "bg-blue-600",
  "Failed": "bg-gray-600"
}

const TaskList = () => {
  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!user?.email) return
        const res = await API.get(`/tasks/user?email=${user.email}`)
        const tasksWithColor = res.data.map(task => {
          const userEntry = task.assignedUsers.find(u => u.email === user.email)
          const status = userEntry?.status || 'Pending'
          return {
            ...task,
            userStatus: status,
            statusColor: statusColorMap[status] || "bg-gray-400",
            color: cardColors[Math.floor(Math.random() * cardColors.length)],
          }
        })
        setTasks(tasksWithColor)
      } catch (err) {
        console.error("Failed to fetch tasks:", err.message)
        setTasks([])
      }
    }

    if (user?.email) fetchTasks()
  }, []) // Removed user from dependencies to prevent auto-refresh

  const handleStatusChange = async (taskId, currentStatus) => {
    const nextStatus = {
      "Pending": "In Progress",
      "In Progress": "Completed",
      "Completed": "Pending"
    }[currentStatus] || "Pending"

    try {
      await API.patch(`/tasks/${taskId}/status`, {
        email: user.email,
        status: nextStatus
      })

      setTasks(prev => prev.map(task =>
        task._id === taskId
          ? {
              ...task,
              userStatus: nextStatus,
              statusColor: statusColorMap[nextStatus]
            }
          : task
      ))
    } catch (err) {
      console.error("Failed to update status:", err.message)
    }
  }

  return (
    <>
      <div className="w-full mx-auto py-10 mt-10 flex flex-col items-center max-w-xs sm:max-w-2xl sm:grid sm:grid-cols-2 sm:gap-8 sm:items-stretch lg:max-w-4xl lg:grid-cols-3" style={{ minHeight: 500 }}>
        {tasks.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-10">No tasks found.</div>
        )}

        {tasks.map((task, idx) => {
          const isDeadlinePassed = task.deadline && new Date(task.deadline) < new Date()
          return (
            <div
              key={task._id}
              className={`relative w-full cursor-pointer shadow-xl rounded-2xl transition-all duration-300 ${task.color} ${idx !== 0 ? '-mt-16' : ''} hover:scale-105 sm:mt-0`}
              style={{
                zIndex: tasks.length - idx,
                boxShadow: '0 8px 24px rgba(0,0,0,0.08), 0 1.5px 4px rgba(0,0,0,0.08)'
              }}
              onClick={() => setSelectedTask(task)}
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
                  <div className="mt-2">
                    <p className="text-sm text-gray-700">
                      Deadline:{" "}
                      <span className={isDeadlinePassed && task.userStatus !== "Completed" ? "text-red-600 font-semibold" : ""}>
                        {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                )}
                <button
                  className="mt-2 bg-white text-gray-900 font-medium text-xs px-3 py-1 rounded shadow hover:bg-gray-100"
                  onClick={async (e) => {
                    e.stopPropagation()
                    await handleStatusChange(task._id, task.userStatus)
                  }}
                >
                  Mark as {task.userStatus === "Pending" ? "In Progress" : task.userStatus === "In Progress" ? "Completed" : "Pending"}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className={`relative w-full max-w-md mx-auto rounded-2xl shadow-2xl ${selectedTask.color} p-8 animate-pop`}>
            <button
              className="absolute top-3 right-3 text-gray-7 00 text-xl font-bold hover:text-red-600"
              onClick={() => setSelectedTask(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex items-center gap-3 mb-4">
              <h3 className={`${selectedTask.statusColor} text-xs px-3 py-1 rounded text-white font-semibold shadow`}>
                {selectedTask.userStatus}
              </h3>
              <h4 className="text-xs text-gray-600">{new Date(selectedTask.date).toLocaleDateString()}</h4>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedTask.title}</h2>
            <p className="text-base text-gray-700">{selectedTask.description}</p>

            {/* Task Queries */}
            <div className="mt-4 border-t pt-4">
              <h4 className="text-lg font-bold text-gray-800 mb-2">Task Queries</h4>
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  const message = e.target.query.value.trim()
                  if (!message) return

                  try {
                    const res = await API.post(`/tasks/${selectedTask._id}/queries`, {
                      user: user.email,
                      message
                    })
                    setSelectedTask(prev => ({ ...prev, queries: res.data }))
                    e.target.reset()
                  } catch (err) {
                    console.error("Failed to add query:", err.message)
                  }
                }}
              >
                <textarea
                  name="query"
                  placeholder="Type your query..."
                  className="w-full p-2 border rounded text-sm mb-2"
                  rows={2}
                />
                <button type="submit" className="bg-blue-600 text-white text-sm px-3 py-1 rounded">Add Query</button>
              </form>

              <ul className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                {selectedTask.queries?.map(q => (
                  <li key={q.id} className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-800">{q.message}</p>
                        <div className="text-xs text-gray-500">{q.user} • {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}</div>
                      </div>
                      {q.user === user.email && (
                        <button
                          onClick={async () => {
                            try {
                              const res = await API.delete(`/tasks/${selectedTask._id}/queries/${q.id}`)
                              setSelectedTask(prev => ({ ...prev, queries: res.data }))
                            } catch (err) {
                              console.error("Failed to delete query:", err.message)
                            }
                          }}
                          className="text-xs text-red-600 hover:text-red-700 ml-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TaskList
