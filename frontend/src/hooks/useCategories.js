// src/hooks/useCategories.js
import { useState, useEffect } from 'react'
import { fetchCategories } from '../api/categories.js'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchCategories()
        if (!cancelled) setCategories(data)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load categories')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { categories, loading, error }
}