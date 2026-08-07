// src/components/post/PostActions.jsx
import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Bookmark } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { toggleLike, toggleBookmark, fetchInteractionStatus } from '../../api/interactions.js'
import SaveToCollectionButton from './SaveToCollectionButton.jsx'

export default function PostActions({ post }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.like_count)

  useEffect(() => {
    if (isAuthenticated) {
      fetchInteractionStatus(post.id).then(({ liked, bookmarked }) => {
        setLiked(liked)
        setBookmarked(bookmarked)
      })
    }
  }, [post.id, isAuthenticated])

  const handleLike = async () => {
    if (!isAuthenticated) return navigate('/login')
    setLiked((prev) => !prev)
    setLikeCount((prev) => prev + (liked ? -1 : 1))
    try {
      const data = await toggleLike(post.id)
      setLiked(data.liked)
      setLikeCount(data.like_count)
    } catch {
      setLiked((prev) => !prev)
      setLikeCount(post.like_count)
    }
  }

  const handleBookmark = async () => {
    if (!isAuthenticated) return navigate('/login')
    setBookmarked((prev) => !prev)
    try {
      const data = await toggleBookmark(post.id)
      setBookmarked(data.bookmarked)
    } catch {
      setBookmarked((prev) => !prev)
    }
  }

  return (
    <div className="flex items-center gap-6 py-4 border-y border-gray-200 dark:border-gray-800 my-6 text-sm text-gray-500">
      <button onClick={handleLike} className={`flex items-center gap-2 transition-colors ${liked ? 'text-red-500' : 'hover:text-red-500'}`}>
        <Heart size={18} fill={liked ? 'currentColor' : 'none'} /> {likeCount}
      </button>
      <span className="flex items-center gap-2">
        <MessageCircle size={18} /> {post.comment_count}
      </span>
      <button onClick={handleBookmark} className={`flex items-center gap-2 transition-colors ${bookmarked ? 'text-indigo-500' : 'hover:text-indigo-500'}`}>
        <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
      </button>
      <div className="ml-auto">
        <SaveToCollectionButton postId={post.id} />
      </div>
    </div>
  )
}