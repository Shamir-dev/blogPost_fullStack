// src/pages/MyArticles.jsx
import { useState, useEffect } from 'react'
import { fetchMyArticles } from '../api/users.js'
import PostListPage from '../components/feed/PostListPage.jsx'

export default function MyArticles() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyArticles().then((data) => { setPosts(data); setLoading(false) })
  }, [])

  return <PostListPage title="My Articles" posts={posts} loading={loading} emptyMessage="You haven't published any articles yet." />
}