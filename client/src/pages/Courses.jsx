import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

// Course selection: students pick a course to give feedback on
function Courses() {
  const [courses, setCourses] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/courses').then(setCourses).catch((err) => setError(err.message))
  }, [])

  if (error) return <div className="alert alert-danger">{error}</div>
  if (!courses) return <div className="spinner-border text-primary"></div>

  const done = courses.filter((c) => c.submitted).length

  return (
    <>
      <div className="hero p-4 mb-4 rounded-3 text-white">
        <h2 className="fw-bold mb-1">Course Feedback &middot; Semester 3</h2>
        <p className="mb-2">Your feedback is anonymous and helps improve teaching.</p>
        <div className="progress bg-white bg-opacity-25" style={{ height: 8 }}>
          <div className="progress-bar bg-warning" style={{ width: `${(done / courses.length) * 100}%` }}></div>
        </div>
        <small>{done} of {courses.length} courses completed</small>
      </div>

      <div className="row g-3">
        {courses.map((c) => (
          <div className="col-md-6 col-lg-4" key={c.id}>
            <div className="card h-100 course-card">
              <div className="card-body d-flex flex-column">
                <small className="text-muted">{c.code}</small>
                <h5 className="card-title">{c.name}</h5>
                <p className="small text-muted">{c.faculty}</p>
                <div className="mt-auto">
                  {c.submitted ? (
                    <span className="badge bg-success">Feedback submitted ✓</span>
                  ) : (
                    <Link to={`/feedback/${c.id}`} className="btn btn-primary btn-sm">Give feedback</Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Courses
