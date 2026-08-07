// src/pages/Profile.jsx
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchUserProfile } from '../api/users.js'
import FollowButton from '../components/user/FollowButton.jsx'

export default function Profile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    fetchUserProfile(id).then(setProfile)
  }, [id])

  if (!profile) return <p className="text-gray-400 text-sm">Loading...</p>

  return (
    <div className="max-w-2xl mx-auto text-center">
      <img src={profile.avatar_url} alt={profile.username} className="w-24 h-24 rounded-full mx-auto mb-4" />
      <h1 className="text-2xl font-bold">{profile.username}</h1>
      {profile.bio && <p className="text-gray-500 mt-2">{profile.bio}</p>}

      <div className="flex justify-center gap-6 mt-4 text-sm">
        <span><b>{profile.posts_count}</b> <span className="text-gray-400">Posts</span></span>
        <span><b>{profile.followers_count}</b> <span className="text-gray-400">Followers</span></span>
        <span><b>{profile.following_count}</b> <span className="text-gray-400">Following</span></span>
      </div>

      <div className="mt-4">
        <FollowButton userId={profile.id} />
      </div>
    </div>
  )
}