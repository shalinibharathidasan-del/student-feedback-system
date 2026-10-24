import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, isStudent, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-indigo">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">Student Feedback</NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
          aria-controls="nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto">
            {isStudent && (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/" end>Courses</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/my-feedback">My Feedback</NavLink></li>
              </>
            )}
          </ul>
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <span className="text-light small">
                  {user.name}{' '}
                  <span className="badge bg-light text-dark">{isStudent ? user.usn : 'Faculty'}</span>
                </span>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <NavLink className="btn btn-outline-light btn-sm" to="/login">Login</NavLink>
                <NavLink className="btn btn-light btn-sm" to="/register">Sign up</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
