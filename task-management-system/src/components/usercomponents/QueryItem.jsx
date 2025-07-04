import React from 'react'
import { formatDistanceToNow } from 'date-fns'

const QueryItem = ({ q, taskId, userEmail, onDelete }) => {
  return (
    <li className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-800">{q.message}</p>
          <div className="text-xs text-gray-500">
            {q.user} • {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}
          </div>
        </div>
        {q.user === userEmail && (
          <button
            onClick={() => onDelete(taskId, q.id)}
            className="text-xs text-red-600 hover:text-red-700 ml-2"
          >
            ✕
          </button>
        )}
      </div>
    </li>
  )
}

export default QueryItem
