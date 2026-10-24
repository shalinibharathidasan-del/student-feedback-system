import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// <ProtectedRoute role="student"> - redirects to /login if logged out, or home if the role does not match
function ProtectedRoute({ children, role }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

export default ProtectedRoute
