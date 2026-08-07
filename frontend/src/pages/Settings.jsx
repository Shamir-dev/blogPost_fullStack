// src/pages/Settings.jsx
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { updateMyProfile, changeMyPassword } from '../api/users.js'
import { uploadImage } from '../api/uploads.js'

const PRESET_AVATARS = [
  { label: 'Boy 1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam' },
  { label: 'Boy 2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah' },
  { label: 'Boy 3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan' },
  { label: 'Boy 4', url: 'https://api.dicebear.com/10.x/notionists/svg' },
  { label: 'Boy 5', url: 'https://api.dicebear.com/10.x/miniavs/svg' },
  { label: 'Girl 1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia' },
  { label: 'Girl 2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
  { label: 'Girl 3', url: 'https://api.dicebear.com/10.x/toon-head/svg' },
  { label: 'Girl 4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia' },
  { label: 'Girl 5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella' },
]

export default function Settings() {
  const { user, setUser } = useAuth()
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setAvatarUrl(`http://localhost:5000${url}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSaveAvatar = async () => {
    setSaving(true)
    try {
      const updated = await updateMyProfile({ avatar_url: avatarUrl })
      setUser(updated)
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess('')
    setPwLoading(true)
    try {
      await changeMyPassword(currentPassword, newPassword)
      setPwSuccess('Password updated successfully.')
      setCurrentPassword('')
      setNewPassword('')
    } catch (err) {
      setPwError(err.response?.data?.error || 'Failed to update password')
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-6">Profile settings</h1>
        <img src={avatarUrl} alt="Current avatar" className="w-24 h-24 rounded-full mx-auto mb-6 border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900" />

        <p className="text-sm font-medium mb-2">Choose an avatar</p>
        <div className="grid grid-cols-5 gap-3 mb-6">
          {PRESET_AVATARS.map((a) => (
            <button key={a.url} onClick={() => setAvatarUrl(a.url)} title={a.label}
              className={`w-14 h-14 rounded-full overflow-hidden border-2 mx-auto bg-gray-100 dark:bg-gray-900 ${avatarUrl === a.url ? 'border-indigo-500' : 'border-transparent'}`}>
              <img src={a.url} alt={a.label} className="w-full h-full" />
            </button>
          ))}
        </div>

        <p className="text-sm font-medium mb-2">Or upload your own</p>
        <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={handleFileChange}
          className="mb-4 text-sm text-gray-600 dark:text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:text-sm file:font-medium hover:file:bg-indigo-700 file:cursor-pointer" />
        {uploading && <p className="text-xs text-gray-400 mb-4">Uploading...</p>}

        <button onClick={handleSaveAvatar} disabled={saving || uploading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg disabled:opacity-50">
          {saving ? 'Saving...' : 'Save avatar'}
        </button>
      </div>

      <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-bold mb-4">Change password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {pwError && <p className="text-red-500 text-sm">{pwError}</p>}
          {pwSuccess && <p className="text-green-500 text-sm">{pwSuccess}</p>}
          <div>
            <label className="text-sm font-medium">Current password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-indigo-400 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium">New password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6}
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-indigo-400 focus:outline-none" />
          </div>
          <button type="submit" disabled={pwLoading}
            className="w-full bg-gray-800 hover:bg-gray-900 dark:bg-gray-100 dark:hover:bg-white text-white dark:text-gray-900 font-medium py-2.5 rounded-lg disabled:opacity-50">
            {pwLoading ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}