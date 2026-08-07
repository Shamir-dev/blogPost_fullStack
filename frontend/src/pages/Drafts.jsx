// src/pages/Drafts.jsx
import { useState, useEffect } from 'react'
import { fetchMyDrafts } from '../api/users.js'
import PostListPage from '../components/feed/PostListPage.jsx'

export default function Drafts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyDrafts().then((data) => { setPosts(data); setLoading(false) })
  }, [])

  return <PostListPage title="Drafts" posts={posts} loading={loading} emptyMessage="No drafts saved." />
}