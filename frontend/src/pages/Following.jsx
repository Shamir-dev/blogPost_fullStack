// src/pages/Following.jsx
import { usePosts } from '../hooks/usePosts.js'
import PostListPage from '../components/feed/PostListPage.jsx'

export default function Following() {
  const { posts, loading } = usePosts('following')
  return <PostListPage title="Following" posts={posts} loading={loading} emptyMessage="Follow some authors to see their posts here." />
}