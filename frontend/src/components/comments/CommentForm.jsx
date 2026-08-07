// src/components/comments/CommentForm.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { postComment } from '../../api/interactions.js'

export default function CommentForm({ postId, onCommentAdded }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!isAuthenticated) return navigate('/login')
    if (!content.trim()) return

    setLoading(true)
    try {
      const comment = await postComment(postId, content)
      onCommentAdded(comment)
      setContent('')
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to post comment')
      console.error('Comment error:', err.response?.data || err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-6">
      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isAuthenticated ? 'Add a comment...' : 'Sign in to comment'}
          className="flex-1 px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-indigo-400 focus:outline-none"
        />
        <button type="submit" disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50">
          Post
        </button>
      </form>
    </div>
  )
}