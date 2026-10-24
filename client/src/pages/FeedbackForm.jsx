import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, RATING_LABELS } from '../api'
import StarRating from '../components/StarRating'

function FeedbackForm() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [rating, setRating] = useState(0)
  const [comments, setComments] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api(`/courses/${courseId}`).then(setCourse).catch((err) => setError(err.message))
  }, [courseId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) return setError('Please choose a rating')
    setBusy(true)
    setError('')
    try {
      const res = await api('/feedback', { method: 'POST', body: { course_id: Number(courseId), rating, comments } })
      navigate('/my-feedback', { state: { message: res.message } })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  if (!course) return error ? <div className="alert alert-danger">{error}</div> : <div className="spinner-border"></div>

  return (
    <div className="row justify-content-center">
      <div className="col-lg-7">
        <Link to="/" className="btn btn-link px-0 mb-2">&larr; Back to courses</Link>
        <div className="card">
          <div className="card-body p-4">
            <small className="text-muted">{course.code}</small>
            <h3>{course.name}</h3>
            <p className="text-muted">Faculty: {course.faculty}</p>
            <hr />
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <label className="form-label fw-semibold d-block">Overall rating</label>
              <div className="d-flex align-items-center gap-3 mb-3">
                <StarRating value={rating} onChange={setRating} size="2.2rem" />
                <span className="text-muted">{RATING_LABELS[rating] || 'Click a star'}</span>
              </div>

              <label className="form-label fw-semibold" htmlFor="comments">Comments</label>
              <textarea
                id="comments"
                className="form-control mb-1"
                rows="5"
                maxLength={1000}
                placeholder="What went well? What could be improved?"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
              <div className="text-end small text-muted mb-3">{comments.length}/1000</div>

              <button className="btn btn-primary btn-lg" disabled={busy}>{busy ? 'Submitting...' : 'Submit feedback'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackForm
