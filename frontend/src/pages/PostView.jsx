// src/pages/PostView.jsx
import { useParams } from 'react-router-dom'
import { usePost } from '../hooks/usePost.js'
import PostHeader from '../components/post/PostHeader.jsx'
import PostActions from '../components/post/PostActions.jsx'
import CommentList from '../components/comments/CommentList.jsx'
import Skeleton from '../components/ui/Skeleton.jsx'

export default function PostView() {
  const { id } = useParams()
  const { post, loading, error } = usePost(id)

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }
  if (error || !post) return <p className="text-red-500 text-sm">Couldn't load this post.</p>

  return (
    <article className="max-w-3xl mx-auto">
      <PostHeader post={post} />
      <img src={post.cover_image} alt={post.title} className="w-full h-80 object-cover rounded-xl mb-6" />
      <PostActions post={post} />
      <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>
      <CommentList postId={post.id} />
    </article>
  )
}