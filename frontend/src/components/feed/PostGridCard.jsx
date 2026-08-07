// src/components/feed/PostGridCard.jsx
import { Heart, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import CategoryBadge from '../category/CategoryBadge.jsx'

export default function PostGridCard({ post }) {
  return (
    <Link to={`/post/${post.id}`}>
      <article className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group h-full">
        <div className="relative h-40 overflow-hidden">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <CategoryBadge category={post.category.name} />
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-base leading-snug line-clamp-2 mb-3">
            {post.title}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <img src={post.author.avatar_url} alt={post.author.username} className="w-6 h-6 rounded-full" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{post.author.username}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{post.read_time}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Heart size={13} /> {post.like_count}</span>
              <span className="flex items-center gap-1"><MessageCircle size={13} /> {post.comment_count}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}