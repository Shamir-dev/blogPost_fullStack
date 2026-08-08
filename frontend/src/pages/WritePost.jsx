// src/pages/WritePost.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCategories } from '../hooks/useCategories.js'
import { createPost, updatePost, fetchPostById } from '../api/posts.js'
import { uploadImage } from '../api/uploads.js'
import { API_BASE_URL } from '../api/axios.js'

export default function WritePost() {
  const { user } = useAuth()
  const { categories } = useCategories()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState('published')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEditMode)

  useEffect(() => {
    if (categories.length && !categoryId) setCategoryId(categories[0].id)
  }, [categories, categoryId])

  useEffect(() => {
    if (!isEditMode) return
    fetchPostById(id).then((post) => {
      setTitle(post.title)
      setContent(post.content)
      setCoverImage(post.cover_image)
      setCategoryId(post.category.id)
      setStatus(post.status)
      setInitialLoading(false)
    })
  }, [id, isEditMode])

  const readTime = `${Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200))} min read`

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setCoverImage(`${API_BASE_URL.replace('/api', '')}${url}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!title.trim() || !content.trim() || !categoryId) {
      setError('Title, content, and category are required')
      return
    }
    setLoading(true)
    try {
      const payload = {
        title, content, excerpt: content.slice(0, 150),
        cover_image: coverImage, category_id: categoryId,
        status, read_time: readTime,
      }
      const post = isEditMode
        ? await updatePost(id, payload)
        : await createPost({ ...payload, author_id: user.id })
      navigate(`/post/${post.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save post')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) return <p className="text-gray-400 text-sm">Loading post...</p>

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit post' : 'Write a new post'}</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="text-sm font-medium">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A compelling title..."
            className="w-full mt-1 px-3 py-2 rounded-lg text-base font-medium bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-indigo-400 focus:outline-none" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Cover image URL</label>
            <span className="text-xs text-indigo-500">Recommended — faster</span>
          </div>
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-indigo-400 focus:outline-none"
          />

          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          </div>

          <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={handleFileChange}
            className="text-sm text-gray-600 dark:text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-200 dark:file:bg-gray-800 file:text-gray-700 dark:file:text-gray-300 file:text-sm file:font-medium hover:file:bg-gray-300 dark:hover:file:bg-gray-700 file:cursor-pointer" />
          {uploading && <p className="text-xs text-gray-400 mt-1">Uploading...</p>}

          {coverImage && !uploading && (
            <img src={coverImage} alt="Cover preview" className="mt-3 w-full h-48 object-cover rounded-lg" onError={(e) => e.target.style.display = 'none'} />
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium">Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-indigo-400 focus:outline-none">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-indigo-400 focus:outline-none">
              <option value="published">Publish now</option>
              <option value="draft">Save as draft</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mt-1 mb-1">
            <label className="text-sm font-medium">Content (Markdown supported)</label>
            <span className="text-xs text-gray-400">{readTime}</span>
          </div>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={14} placeholder="Write your article..."
            className="w-full px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-indigo-400 focus:outline-none font-mono" />
        </div>

        <button type="submit" disabled={loading || uploading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50">
          {loading ? 'Saving...' : isEditMode ? 'Update Post' : status === 'draft' ? 'Save Draft' : 'Publish Post'}
        </button>
      </form>
    </div>
  )
}