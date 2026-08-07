// src/hooks/usePosts.js
import { useState, useEffect, useCallback } from 'react'
import { fetchPosts } from '../api/posts.js'

export function usePosts(sort = 'recent', category = null) {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setPage(1)

    fetchPosts(sort, category, 1)
      .then((data) => {
        if (cancelled) return
        setPosts(data.posts)
        setHasMore(data.has_more)
      })
      .catch((err) => !cancelled && setError(err.message || 'Failed to load posts'))
      .finally(() => !cancelled && setLoading(false))

    return () => { cancelled = true }
  }, [sort, category])

  const loadMore = useCallback(async () => {
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const data = await fetchPosts(sort, category, nextPage)
      setPosts((prev) => [...prev, ...data.posts])
      setHasMore(data.has_more)
      setPage(nextPage)
    } catch (err) {
      setError(err.message || 'Failed to load more posts')
    } finally {
      setLoadingMore(false)
    }
  }, [sort, category, page])

  return { posts, loading, loadingMore, hasMore, loadMore, error }
}