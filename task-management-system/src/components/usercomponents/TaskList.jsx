import React, { useState, useEffect, useRef } from 'react'
import API from '../../api'
import { formatDistanceToNow } from 'date-fns'
import { useNavigate } from 'react-router-dom'

const cardColors = [
  "bg-yellow-300", "bg-blue-200", "bg-green-200",
  "bg-pink-200", "bg-purple-200", "bg-orange-200",
  "bg-teal-200", "bg-indigo-200"
]

const statusColorMap = {
  "Pending": "bg-red-600",
  "In Progress": "bg-blue-600",
  "Completed": "bg-green-600",
  "Failed": "bg-gray-600"
}

const TaskList = () => {
  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [submitContent, setSubmitContent] = useState("")
  const [taskToSubmit, setTaskToSubmit] = useState(null)
  const user = JSON.parse(localStorage.getItem("user"))
  const navigate = useNavigate()
  const hasMountedOnce = useRef(false)

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const checkDeadlines = (tasks) => {
    const today = new Date()
    return tasks.map(task => {
      if (task.deadline && task.deadline < today && task.userStatus !== "Completed") {
        return {
          ...task,
          userStatus: "Failed",
          statusColor: statusColorMap["Failed"]
        }
      }
      return task
    })
  }

  const fetchTasks = async () => {
    if (!isValidEmail(user?.email)) return
    if (!hasMountedOnce.current) setLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate delay
      const res = await API.get(`/tasks/user?email=${user.email}`)
      const colored = res.data.map(task => {
        const userEntry = task.assignedUsers.find(u => u.email === user.email)
        return {
          ...task,
          userStatus: userEntry?.status || 'Pending',
          statusColor: statusColorMap[userEntry?.status] || "bg-gray-400",
          color: cardColors[Math.floor(Math.random() * cardColors.length)],
          deadline: task.deadline ? new Date(task.deadline) : null
        }
      })
      const updatedTasks = checkDeadlines(colored)
      setTasks(updatedTasks)
    } catch (err) {
      console.error("Failed to fetch tasks:", err.message)
    } finally {
      if (!hasMountedOnce.current) {
        setLoading(false)
        hasMountedOnce.current = true
      }
    }
  }

  useEffect(() => {
    if (user?.email) fetchTasks()
  }, [user])

  const updateTaskStatus = async (task, status, submission = "") => {
    try {
      await API.patch(`/tasks/${task._id}/status`, {
        email: user.email,
        status,
        submission
      })

      setTasks(prev =>
        prev.map(t =>
          t._id === task._id ? {
            ...t,
            userStatus: status,
            statusColor: statusColorMap[status]
          } : t
        )
      )
      setShowSubmitModal(false)
      setSubmitContent("")
      setTaskToSubmit(null)
    } catch (err) {
      console.error("Failed to update status:", err.message)
    }
  }

  const handleStatusCycle = async (task) => {
    const today = new Date()
    if (task.deadline && task.deadline < today) return

    const nextStatus = {
      "Pending": "In Progress",
      "In Progress": "Completed",
      "Completed": "Pending"
    }[task.userStatus] || "Pending"

    if (task.userStatus === "In Progress" && nextStatus === "Completed") {
      setTaskToSubmit(task)
      setShowSubmitModal(true)
      return
    }

    await updateTaskStatus(task, nextStatus)
  }

  const formatDate = (date) => {
    if (!date) return 'No deadline'
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  const SkeletonCard = () => (
    <div className="relative w-full h-64 bg-gray-200 rounded-2xl shadow-xl animate-pulse sm:mt-0" />
  )

  const cardTasks = tasks.slice(0, 8)

  return (
    <>
      {/* === Task Cards === */}
      <div className="w-full mx-auto py-10 mt-10 flex flex-col items-center max-w-xs sm:max-w-2xl sm:grid sm:grid-cols-2 sm:gap-8 lg:max-w-4xl lg:grid-cols-3" style={{ minHeight: 500 }}>
        {loading ? (
          [...Array(6)].map((_, idx) => <SkeletonCard key={idx} />)
        ) : cardTasks.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-10">No tasks found.</div>
        ) : cardTasks.map((task, idx) => (
          <div key={task._id} onClick={() => setSelectedTask(task)}
            className={`relative w-full cursor-pointer shadow-xl rounded-2xl transition-all duration-300 ${task.color} ${idx !== 0 ? '-mt-16' : ''} hover:scale-105 sm:mt-0`}
            style={{ zIndex: tasks.length - idx }}
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
              <p className="text-xs font-bold text-gray-500 mt-1">Deadline: {formatDate(task.deadline)}</p>
              <button
                className={`mt-2 bg-white text-gray-900 font-medium text-xs px-3 py-1 rounded shadow ${
                  task.deadline && task.deadline < new Date() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (task.deadline && task.deadline < new Date()) return
                  handleStatusCycle(task)
                }}
                disabled={task.deadline && task.deadline < new Date()}
              >
                Mark as {task.userStatus === "Pending" ? "In Progress" : task.userStatus === "In Progress" ? "Completed" : "Pending"}
              </button>
            </div>
          </div>
        ))}

        {!loading && tasks.length > 8 && (
          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition"
            onClick={() => navigate('/task-list-preview')}>
            <h2 className="text-lg font-semibold text-blue-600">Show All</h2>
            <p className="text-sm text-gray-500 text-center mt-2">View all {tasks.length} tasks in detail</p>
          </div>
        )}
      </div>

      {/* === Task Details Modal === */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
          <div className={`relative w-full max-w-md mx-auto rounded-2xl shadow-2xl ${selectedTask.color} p-8 animate-pop`}>
            <button onClick={() => setSelectedTask(null)} className="absolute top-3 right-3 text-xl font-bold text-gray-700 hover:text-red-600">&times;</button>
            <div className="flex items-center gap-3 mb-4">
              <h3 className={`${selectedTask.statusColor} text-xs px-3 py-1 rounded text-white font-semibold shadow`}>
                {selectedTask.userStatus}
              </h3>
              <h4 className="text-xs text-gray-600">{new Date(selectedTask.date).toLocaleDateString()}</h4>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedTask.title}</h2>
            <p className="text-base text-gray-700">{selectedTask.description}</p>
            <p className="text-sm font-bold text-gray-500 mt-1">Deadline: {formatDate(selectedTask.deadline)}</p>
            {selectedTask.submission && (
              <p className="mt-2 text-sm text-gray-700"><strong>Submission:</strong> {selectedTask.submission}</p>
            )}

            {/* Task Queries */}
            <div className="mt-4 border-t pt-4">
              <h4 className="text-lg font-bold text-gray-800 mb-2">Task Queries</h4>
              <form onSubmit={async (e) => {
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
              }}>
                <textarea name="query" placeholder="Type your query..." className="w-full p-2 border rounded text-sm mb-2" rows={2} />
                <button type="submit" className="bg-blue-600 text-white text-sm px-3 py-1 rounded">Add Query</button>
              </form>

              <ul className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                {selectedTask.queries?.map(q => (
                  <li key={q.id} className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-800">{q.message}</p>
                        <small className="text-xs text-gray-500">
                          {q.user} • {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}
                        </small>
                      </div>
                      {q.user === user.email && (
                        <button onClick={async () => {
                          try {
                            const res = await API.delete(`/tasks/${selectedTask._id}/queries/${q.id}`)
                            setSelectedTask(prev => ({ ...prev, queries: res.data }))
                          } catch (err) {
                            console.error("Delete query failed:", err.message)
                          }
                        }} className="text-xs text-red-600 hover:text-red-700 ml-2">✕</button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* === Submit Task Modal === */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Submit Task</h2>
            <p className="text-sm text-gray-500 mb-4">Please describe or paste your task submission result.</p>
            <textarea
              rows="4"
              value={submitContent}
              onChange={(e) => setSubmitContent(e.target.value)}
              placeholder="E.g., link to document, result, summary..."
              className="w-full p-2 border rounded mb-4 text-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowSubmitModal(false)
                  setSubmitContent("")
                  setTaskToSubmit(null)
                }}
                className="text-gray-600 text-sm hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!submitContent.trim()) return
                  updateTaskStatus(taskToSubmit, "Completed", submitContent.trim())
                }}
                className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
              >
                Submit & Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TaskList
