// src/components/post/SaveToCollectionButton.jsx
import { useState, useEffect, useRef } from 'react'
import { FolderPlus, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { fetchMyCollections, addPostToCollection } from '../../api/collections.js'

export default function SaveToCollectionButton({ postId }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [collections, setCollections] = useState([])
  const [savedTo, setSavedTo] = useState(new Set())
  const ref = useRef(null)

  useEffect(() => {
    if (open && isAuthenticated) {
      fetchMyCollections().then(setCollections)
    }
  }, [open, isAuthenticated])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => {
    if (!isAuthenticated) return navigate('/login')
    setOpen((prev) => !prev)
  }

  const handleAdd = async (collectionId) => {
    await addPostToCollection(collectionId, postId)
    setSavedTo((prev) => new Set(prev).add(collectionId))
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={handleToggle} className="flex items-center gap-2 hover:text-indigo-500 transition-colors">
        <FolderPlus size={18} /> Save
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-20 p-2">
          {collections.length === 0 ? (
            <p className="text-xs text-gray-400 p-2">No collections yet — create one from the Collections page.</p>
          ) : (
            collections.map((c) => (
              <button
                key={c.id}
                onClick={() => handleAdd(c.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {c.name}
                {savedTo.has(c.id) && <Check size={14} className="text-green-500" />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}