// src/pages/Auth/Register.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(username, email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Create your account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label className="text-sm font-medium">Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
            className="w-full mt-1 px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-indigo-400 focus:outline-none" />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full mt-1 px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-indigo-400 focus:outline-none" />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
            className="w-full mt-1 px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-indigo-400 focus:outline-none" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50">
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="text-sm text-center mt-4 text-gray-500">
        Already have an account? <Link to="/login" className="text-indigo-600 font-medium">Sign in</Link>
      </p>
    </div>
  )
}