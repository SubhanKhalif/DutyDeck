import React from 'react'
import API from '../../api'

const TaskQueryForm = ({ taskId, user, onQueryAdd }) => {
  const handleSubmit = async (e) => {
    e.preventDefault()
    const message = e.target.query.value.trim()
    if (!message) return

    try {
      const res = await API.post(`/tasks/${taskId}/queries`, {
        user: user.email,
        message
      })
      onQueryAdd(res.data)
      e.target.reset()
    } catch (err) {
      console.error("Failed to add query:", err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea name="query" placeholder="Type your query..." className="w-full p-2 border rounded text-sm mb-2" rows={2} />
      <button type="submit" className="bg-blue-600 text-white text-sm px-3 py-1 rounded">Add Query</button>
    </form>
  )
}

export default TaskQueryForm
