import React from 'react'
import API from '../../api'
import { formatDistanceToNow } from 'date-fns'

const TaskQueryList = ({ queries, user, onQueryDelete, taskId }) => {
  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/tasks/${taskId}/queries/${id}`)
      onQueryDelete(res.data)
    } catch (err) {
      console.error("Delete query failed:", err.message)
    }
  }

  return (
    <ul className="mt-4 space-y-2 max-h-48 overflow-y-auto">
      {queries?.map(q => (
        <li key={q.id} className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-800">{q.message}</p>
              <small className="text-xs text-gray-500">
                {q.user} • {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}
              </small>
            </div>
            {q.user === user.email && (
              <button onClick={() => handleDelete(q.id)} className="text-xs text-red-600 hover:text-red-700 ml-2">✕</button>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default TaskQueryList
