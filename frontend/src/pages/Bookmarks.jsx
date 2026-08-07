// src/pages/Bookmarks.jsx
import { useState, useEffect } from 'react'
import { fetchMyBookmarks } from '../api/users.js'
import PostListPage from '../components/feed/PostListPage.jsx'

export default function Bookmarks() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyBookmarks().then((data) => { setPosts(data); setLoading(false) })
  }, [])

  return <PostListPage title="Bookmarks" posts={posts} loading={loading} emptyMessage="No bookmarks yet." />
}