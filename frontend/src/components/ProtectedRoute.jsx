import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, checkAuth } = useAuthStore()

  // Check authentication
  if (!isAuthenticated && !checkAuth()) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
