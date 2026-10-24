import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, formatDate } from '../../api'
import StarRating from '../../components/StarRating'

// All feedback for one course (student names are not shown)
function CourseFeedback() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api(`/faculty/courses/${id}/feedback`).then(setData).catch((err) => setError(err.message))
  }, [id])

  if (error) return <div className="alert alert-danger">{error}</div>
  if (!data) return <div className="spinner-border"></div>

  const { course, feedback } = data

  return (
    <>
      <Link to="/" className="btn btn-link px-0 mb-2">&larr; Dashboard</Link>
      <h2 className="mb-0">{course.name}</h2>
      <p className="text-muted">{course.code} &middot; {course.faculty} &middot; {feedback.length} response(s)</p>

      {feedback.length === 0 ? (
        <p className="text-muted">No feedback yet.</p>
      ) : (
        <div className="row g-3">
          {feedback.map((f, i) => (
            <div className="col-md-6" key={f.id}>
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <StarRating value={f.rating} />
                    <small className="text-muted">Student {feedback.length - i} &middot; {formatDate(f.submitted_at)}</small>
                  </div>
                  <p className="mb-0 mt-2">{f.comments || <span className="text-muted">No comment</span>}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default CourseFeedback
