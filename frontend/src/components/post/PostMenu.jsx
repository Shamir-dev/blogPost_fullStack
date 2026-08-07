// src/components/post/PostMenu.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { deletePost } from '../../api/posts.js'

export default function PostMenu({ post, onDeleted }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  if (!user || user.id !== post.author.id) return null

  const handleDelete = async () => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    await deletePost(post.id)
    if (onDeleted) onDeleted(post.id)
    else navigate('/')
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen((p) => !p)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-400">
        <MoreHorizontal size={18} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-20 overflow-hidden">
            <button
              onClick={() => navigate(`/edit/${post.id}`)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}