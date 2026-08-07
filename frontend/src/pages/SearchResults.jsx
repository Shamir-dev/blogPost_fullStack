// src/pages/SearchResults.jsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchPosts } from '../api/posts.js'
import PostListPage from '../components/feed/PostListPage.jsx'

export default function SearchResults() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    searchPosts(q).then((data) => { setPosts(data); setLoading(false) })
  }, [q])

  return <PostListPage title={`Results for "${q}"`} posts={posts} loading={loading} emptyMessage="No matching posts." />
}