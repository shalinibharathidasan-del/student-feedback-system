import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Courses from './pages/Courses'
import FeedbackForm from './pages/FeedbackForm'
import MyFeedback from './pages/MyFeedback'

// Home page depends on who is logged in
function Home() {
  const { user, isStudent } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (isStudent) return <Courses />
  return <div className="alert alert-info">Faculty dashboard is coming soon.</div>
}

function App() {
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feedback/:courseId" element={<ProtectedRoute role="student"><FeedbackForm /></ProtectedRoute>} />
          <Route path="/my-feedback" element={<ProtectedRoute role="student"><MyFeedback /></ProtectedRoute>} />
          <Route path="*" element={<h3>Page not found</h3>} />
        </Routes>
      </main>
    </>
  )
}

export default App
