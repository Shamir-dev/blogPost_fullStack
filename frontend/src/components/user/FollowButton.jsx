// src/components/user/FollowButton.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { toggleFollow, fetchUserProfile } from '../../api/users.js'

export default function FollowButton({ userId, initialFollowing = false }) {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [following, setFollowing] = useState(initialFollowing)

  if (isAuthenticated && user?.id === userId) return null // can't follow yourself

  const handleClick = async () => {
    if (!isAuthenticated) return navigate('/login')
    setFollowing((prev) => !prev)
    try {
      const data = await toggleFollow(userId)
      setFollowing(data.following)
    } catch {
      setFollowing((prev) => !prev)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-colors ${
        following
          ? 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400'
          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
      }`}
    >
      {following ? 'Following' : 'Follow'}
    </button>
  )
}