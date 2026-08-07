// src/components/comments/CommentList.jsx
import { useState, useEffect } from 'react'
import { fetchComments } from '../../api/interactions.js'
import CommentForm from './CommentForm.jsx'
import CommentItem from './CommentItem.jsx'

export default function CommentList({ postId }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComments(postId).then((data) => {
      setComments(data)
      setLoading(false)
    })
  }, [postId])

  return (
    <div className="mt-8">
      <h3 className="font-semibold mb-4">Comments ({comments.length})</h3>
      <CommentForm postId={postId} onCommentAdded={(c) => setComments((prev) => [c, ...prev])} />
      {loading ? (
        <p className="text-sm text-gray-400">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-400">No comments yet — be the first.</p>
      ) : (
        comments.map((c) => <CommentItem key={c.id} comment={c} />)
      )}
    </div>
  )
}