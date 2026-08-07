// src/components/feed/PostListPage.jsx
import PostGridCard from './PostGridCard.jsx'
import EmptyState from './EmptyState.jsx'
import { PostCardSkeleton } from '../ui/Skeleton.jsx'

export default function PostListPage({ title, posts, loading, emptyMessage }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {posts.map((p) => <PostGridCard key={p.id} post={p} />)}
        </div>
      )}
    </div>
  )
}