// src/hooks/usePost.js
import { useState, useEffect } from 'react'
import { fetchPostById } from '../api/posts.js'

export function usePost(id) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchPostById(id)
        if (!cancelled) setPost(data)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load post')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [id])

  return { post, loading, error }
}