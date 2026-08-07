// src/pages/Auth/ForgotPassword.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '../../api/auth.js'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await requestPasswordReset(email)
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Reset your password</h1>
      {submitted ? (
        <p className="text-sm text-center text-gray-500">
          If that email exists, your request has been sent to the admin. You'll receive a temporary password once it's processed.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-indigo-400 focus:outline-none" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg disabled:opacity-50">
            {loading ? 'Sending...' : 'Send request'}
          </button>
        </form>
      )}
      <p className="text-sm text-center mt-4 text-gray-500">
        <Link to="/login" className="text-indigo-600 font-medium">Back to sign in</Link>
      </p>
    </div>
  )
}