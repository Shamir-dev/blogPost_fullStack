// src/pages/Explore.jsx
import { useState } from 'react'
import FilterTabs from '../components/feed/FilterTabs.jsx'
import PostGridCard from '../components/feed/PostGridCard.jsx'
import EmptyState from '../components/feed/EmptyState.jsx'
import { PostCardSkeleton } from '../components/ui/Skeleton.jsx'
import { usePosts } from '../hooks/usePosts.js'

export default function Explore() {
  const [activeSort, setActiveSort] = useState('trending')
  // src/pages/Explore.jsx — update destructure to match new shape
const { posts, loading, loadingMore, hasMore, loadMore, error } = usePosts(activeSort)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Explore</h1>
      <div className="flex items-center justify-between mb-6">
        <FilterTabs active={activeSort} onChange={setActiveSort} />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">Couldn't load posts.</p>}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <PostCardSkeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState message="No posts found." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {posts.map((post) => <PostGridCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  )
}