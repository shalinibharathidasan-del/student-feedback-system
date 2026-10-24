import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import StarRating from '../../components/StarRating'

// Faculty/admin view: average rating and 1-5 star breakdown for every course
function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/faculty/summary').then(setData).catch((err) => setError(err.message))
  }, [])

  if (error) return <div className="alert alert-danger">{error}</div>
  if (!data) return <div className="spinner-border text-primary"></div>

  const { totals, courses } = data

  return (
    <>
      <h2 className="mb-3">Feedback Dashboard</h2>

      <div className="row g-3 mb-4">
        <div className="col-sm-4">
          <div className="card text-center"><div className="card-body">
            <div className="display-6 text-primary">{totals.responses}</div>Responses
          </div></div>
        </div>
        <div className="col-sm-4">
          <div className="card text-center"><div className="card-body">
            <div className="display-6 text-warning">{totals.average ?? '-'}</div>Average rating
          </div></div>
        </div>
        <div className="col-sm-4">
          <div className="card text-center"><div className="card-body">
            <div className="display-6 text-success">{totals.students}</div>Registered students
          </div></div>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr><th>Course</th><th>Faculty</th><th>Average</th><th style={{ minWidth: 180 }}>Rating breakdown</th><th>Responses</th><th></th></tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id}>
                  <td><small className="text-muted">{c.code}</small><br />{c.name}</td>
                  <td className="small">{c.faculty}</td>
                  <td className="text-nowrap">
                    {c.average ? <><StarRating value={c.average} size="1rem" /> <b>{c.average}</b></> : <span className="text-muted">No feedback</span>}
                  </td>
                  <td>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <div className="d-flex align-items-center gap-2 small" key={n}>
                        <span style={{ width: 22 }}>{n}★</span>
                        <div className="progress flex-grow-1" style={{ height: 6 }}>
                          <div className="progress-bar bg-warning" style={{ width: `${c.responses ? (c.breakdown[n - 1] / c.responses) * 100 : 0}%` }}></div>
                        </div>
                        <span style={{ width: 14 }}>{c.breakdown[n - 1]}</span>
                      </div>
                    ))}
                  </td>
                  <td><span className="badge bg-primary rounded-pill">{c.responses}</span></td>
                  <td><Link to={`/faculty/courses/${c.id}`} className="btn btn-sm btn-outline-primary">Comments</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Dashboard
