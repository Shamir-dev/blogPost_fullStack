// src/components/feed/EmptyState.jsx
import { FileQuestion } from 'lucide-react'

export default function EmptyState({ message = 'No posts found.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
      <FileQuestion size={40} className="mb-3" />
      <p className="text-sm">{message}</p>
    </div>
  )
}