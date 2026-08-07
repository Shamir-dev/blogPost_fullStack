// src/components/post/PostHeader.jsx
import CategoryBadge from '../category/CategoryBadge.jsx'
import PostMenu from './PostMenu.jsx'

export default function PostHeader({ post }) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between">
        <CategoryBadge category={post.category.name} />
        <PostMenu post={post} />
      </div>
      <h1 className="text-3xl font-bold mt-3 mb-4 leading-tight">{post.title}</h1>

      <div className="flex items-center gap-3">
        <img src={post.author.avatar_url} alt={post.author.username} className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-medium text-sm">{post.author.username}</p>
          <p className="text-xs text-gray-400">
            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {' · '}{post.read_time}
          </p>
        </div>
      </div>
    </div>
  )
}