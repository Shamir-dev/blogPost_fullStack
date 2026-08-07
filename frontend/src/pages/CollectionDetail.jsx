// src/pages/CollectionDetail.jsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchCollection } from '../api/collections.js'
import PostGridCard from '../components/feed/PostGridCard.jsx'
import EmptyState from '../components/feed/EmptyState.jsx'

export default function CollectionDetail() {
  const { id } = useParams()
  const [collection, setCollection] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCollection(id).then((data) => { setCollection(data); setLoading(false) })
  }, [id])

  if (loading) return <p className="text-gray-400 text-sm">Loading...</p>
  if (!collection) return <p className="text-red-500 text-sm">Collection not found.</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{collection.name}</h1>
      {collection.posts.length === 0 ? (
        <EmptyState message="No posts in this collection yet." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {collection.posts.map((post) => <PostGridCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  )
}