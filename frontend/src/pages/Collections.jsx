// src/pages/Collections.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FolderOpen, Plus, Trash2 } from 'lucide-react'
import { fetchMyCollections, createCollection, deleteCollection } from '../api/collections.js'

export default function Collections() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  const load = () => {
    fetchMyCollections().then((data) => { setCollections(data); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    try {
      await createCollection(newName)
      setNewName('')
      load()
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this collection?')) return
    await deleteCollection(id)
    load()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Collections</h1>

      <form onSubmit={handleCreate} className="flex gap-3 mb-6">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New collection name..."
          className="flex-1 px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-indigo-400 focus:outline-none"
        />
        <button type="submit" disabled={creating}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50">
          <Plus size={16} /> Create
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : collections.length === 0 ? (
        <p className="text-sm text-gray-400">No collections yet — create one above.</p>
      ) : (
        <div className="space-y-2">
          {collections.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
              <Link to={`/collections/${c.id}`} className="flex items-center gap-3">
                <FolderOpen size={18} className="text-indigo-500" />
                <span className="font-medium text-sm">{c.name}</span>
                <span className="text-xs text-gray-400">{c.post_count} posts</span>
              </Link>
              <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}