// src/pages/Auth/Login.jsx — full file, adds Forgot password link
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Welcome back</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label className="text-sm font-medium">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full mt-1 px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-indigo-400 focus:outline-none" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Password</label>
            <Link to="/forgot-password" className="text-xs text-indigo-600">Forgot password?</Link>
          </div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="w-full mt-1 px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-indigo-400 focus:outline-none" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="text-sm text-center mt-4 text-gray-500">
        Don't have an account? <Link to="/register" className="text-indigo-600 font-medium">Register</Link>
      </p>
    </div>
  )
}