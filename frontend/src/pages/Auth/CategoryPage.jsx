// src/pages/CategoryPage.jsx
import { useParams } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts.js'
import PostListPage from '../components/feed/PostListPage.jsx'

export default function CategoryPage() {
  const { slug } = useParams()
  const { posts, loading } = usePosts('recent', slug)

  const title = slug
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' & ')

  return <PostListPage title={title} posts={posts} loading={loading} emptyMessage="No posts in this category yet." />
}