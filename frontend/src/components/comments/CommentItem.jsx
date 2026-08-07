// src/components/comments/CommentItem.jsx
export default function CommentItem({ comment }) {
  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 dark:border-gray-900 last:border-0">
      <img src={comment.user.avatar_url} alt={comment.user.username} className="w-8 h-8 rounded-full" />
      <div>
        <p className="text-sm font-medium">{comment.user.username}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{comment.content}</p>
      </div>
    </div>
  )
}