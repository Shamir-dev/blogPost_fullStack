// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react'
import { Trash2, Check, Clock, Plus } from 'lucide-react'
import {
  fetchStats, fetchAllUsers, deleteUserAdmin, fetchAllPosts, deletePostAdmin,
  fetchPasswordResets, fetchPasswordResetHistory, resolvePasswordReset,
} from '../api/admin.js'
import { fetchCategories, createCategory, deleteCategory } from '../api/categories.js'

export default function AdminDashboard() {
  const [tab, setTab] = useState('resets')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [resets, setResets] = useState([])
  const [history, setHistory] = useState([])
  const [resolvedInfo, setResolvedInfo] = useState(null)

  const [categories, setCategories] = useState([])
  const [newCatName, setNewCatName] = useState('')
  const [catError, setCatError] = useState('')
  const [catSaving, setCatSaving] = useState(false)

  const loadUsers = () => fetchAllUsers().then(setUsers)
  const loadPosts = () => fetchAllPosts().then(setPosts)
  const loadResets = () => fetchPasswordResets().then(setResets)
  const loadHistory = () => fetchPasswordResetHistory().then(setHistory)
  const loadCategories = () => fetchCategories().then(setCategories)

  useEffect(() => {
    fetchStats().then(setStats)
    loadUsers()
    loadPosts()
    loadResets()
    loadHistory()
    loadCategories()
  }, [])

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user and all their content?')) return
    await deleteUserAdmin(id)
    loadUsers()
  }

  const handleDeletePost = async (id) => {
    if (!confirm('Delete this post?')) return
    await deletePostAdmin(id)
    loadPosts()
  }

  const handleResolveReset = async (id) => {
    const data = await resolvePasswordReset(id)
    setResolvedInfo(data)
    loadResets()
    loadHistory()
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    setCatError('')
    if (!newCatName.trim()) return
    setCatSaving(true)
    try {
      await createCategory(newCatName)
      setNewCatName('')
      loadCategories()
    } catch (err) {
      setCatError(err.response?.data?.error || 'Failed to create category')
    } finally {
      setCatSaving(false)
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!confirm('Delete this category?')) return
    try {
      await deleteCategory(id)
      loadCategories()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete category')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="text-2xl font-bold">{stats.total_users}</p>
            <p className="text-xs text-gray-400">Users</p>
          </div>
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="text-2xl font-bold">{stats.total_posts}</p>
            <p className="text-xs text-gray-400">Published Posts</p>
          </div>
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="text-2xl font-bold">{stats.total_drafts}</p>
            <p className="text-xs text-gray-400">Drafts</p>
          </div>
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="text-2xl font-bold">{stats.pending_resets}</p>
            <p className="text-xs text-gray-400">Pending Resets</p>
          </div>
        </div>
      )}

      {resolvedInfo && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-950 text-sm">
          <p className="font-medium">Password reset for {resolvedInfo.user_email}</p>
          <p>Temporary password: <code className="font-mono bg-white dark:bg-gray-900 px-2 py-0.5 rounded">{resolvedInfo.new_password}</code></p>
          <p className="text-xs text-gray-500 mt-1">Share this with the user manually — it won't be shown again.</p>
        </div>
      )}

      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setTab('resets')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'resets' ? 'bg-indigo-600 text-white' : 'border border-gray-200 dark:border-gray-800'}`}>Pending Resets</button>
        <button onClick={() => setTab('history')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'history' ? 'bg-indigo-600 text-white' : 'border border-gray-200 dark:border-gray-800'}`}>Reset History</button>
        <button onClick={() => setTab('users')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'users' ? 'bg-indigo-600 text-white' : 'border border-gray-200 dark:border-gray-800'}`}>Users</button>
        <button onClick={() => setTab('posts')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'posts' ? 'bg-indigo-600 text-white' : 'border border-gray-200 dark:border-gray-800'}`}>Posts</button>
        <button onClick={() => setTab('categories')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'categories' ? 'bg-indigo-600 text-white' : 'border border-gray-200 dark:border-gray-800'}`}>Categories</button>
      </div>

      {tab === 'resets' && (
        <div className="space-y-2">
          {resets.length === 0 ? (
            <p className="text-sm text-gray-400">No pending requests.</p>
          ) : (
            resets.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                <div>
                  <p className="text-sm font-medium">{r.user.username}</p>
                  <p className="text-xs text-gray-400">{r.user.email}</p>
                </div>
                <button onClick={() => handleResolveReset(r.id)} className="flex items-center gap-1 text-sm text-indigo-600 hover:underline">
                  <Check size={14} /> Resolve
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="text-sm text-gray-400">No resolved resets yet.</p>
          ) : (
            history.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                <div>
                  <p className="text-sm font-medium">{r.user.username}</p>
                  <p className="text-xs text-gray-400">{r.user.email}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={12} /> {new Date(r.resolved_at).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'users' && (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <img src={u.avatar_url} alt={u.username} className="w-8 h-8 rounded-full" />
                <div>
                  <p className="text-sm font-medium">{u.username} {u.is_admin && <span className="text-xs text-indigo-500">(admin)</span>}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
              </div>
              {!u.is_admin && (
                <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'posts' && (
        <div className="space-y-2">
          {posts.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800">
              <div>
                <p className="text-sm font-medium">{p.title}</p>
                <p className="text-xs text-gray-400">by {p.author.username} · {p.status}</p>
              </div>
              <button onClick={() => handleDeletePost(p.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}

      {tab === 'categories' && (
        <div>
          <form onSubmit={handleCreateCategory} className="flex gap-3 mb-4">
            <input
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="New category name..."
              className="flex-1 px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-indigo-400 focus:outline-none"
            />
            <button type="submit" disabled={catSaving}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50">
              <Plus size={16} /> Add
            </button>
          </form>
          {catError && <p className="text-red-500 text-sm mb-4">{catError}</p>}

          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.post_count} posts</p>
                </div>
                <button onClick={() => handleDeleteCategory(c.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}