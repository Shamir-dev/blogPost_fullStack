// src/pages/Home.jsx
import { useState } from 'react'
import FilterTabs from '../components/feed/FilterTabs.jsx'
import PostGridCard from '../components/feed/PostGridCard.jsx'
import EmptyState from '../components/feed/EmptyState.jsx'
import { PostCardSkeleton } from '../components/ui/Skeleton.jsx'
import { usePosts } from '../hooks/usePosts.js'

export default function Home() {
  const [activeSort, setActiveSort] = useState('popular')
  const { posts, loading, loadingMore, hasMore, loadMore, error } = usePosts(activeSort)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <FilterTabs active={activeSort} onChange={setActiveSort} />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">Couldn't load posts.</p>}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <PostCardSkeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState message="No posts yet — write the first one!" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {posts.map((post) => <PostGridCard key={post.id} post={post} />)}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button onClick={loadMore} disabled={loadingMore}
                className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 disabled:opacity-50">
                {loadingMore ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}