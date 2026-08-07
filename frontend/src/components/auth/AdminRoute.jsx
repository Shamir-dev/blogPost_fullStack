// src/components/auth/AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminRoute() {
  const { user, loading } = useAuth()
  if (loading) return <p className="text-center text-gray-400 mt-16">Loading...</p>
  if (!user?.is_admin) return <Navigate to="/" replace />
  return <Outlet />
}