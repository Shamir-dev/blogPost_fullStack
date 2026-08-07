// src/components/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <p className="text-center text-gray-400 mt-16">Loading...</p>
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return <Outlet />
}