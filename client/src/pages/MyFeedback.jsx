import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { api, formatDate } from '../api'
import StarRating from '../components/StarRating'

function MyFeedback() {
  const location = useLocation()
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/feedback/my').then(setRows).catch((err) => setError(err.message))
  }, [])

  if (error) return <div className="alert alert-danger">{error}</div>
  if (!rows) return <div className="spinner-border"></div>

  return (
    <>
      <h2 className="mb-3">My Feedback</h2>
      {location.state?.message && <div className="alert alert-success">{location.state.message}</div>}
      {rows.length === 0 ? (
        <p className="text-muted">You have not submitted any feedback yet. <Link to="/">Choose a course</Link></p>
      ) : (
        <div className="row g-3">
          {rows.map((f) => (
            <div className="col-md-6" key={f.id}>
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <small className="text-muted">{f.code}</small>
                      <h5 className="mb-0">{f.name}</h5>
                    </div>
                    <small className="text-muted">{formatDate(f.submitted_at)}</small>
                  </div>
                  <StarRating value={f.rating} />
                  {f.comments && <p className="mb-0 mt-2 fst-italic">“{f.comments}”</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default MyFeedback
