import { useState } from 'react'

// Reusable star rating.
//   <StarRating value={3} />                      read-only
//   <StarRating value={rating} onChange={setRating} />  clickable
function StarRating({ value, onChange, size = '1.4rem' }) {
  const [hover, setHover] = useState(0)
  const shown = hover || Math.round(value)

  return (
    <span className="stars" style={{ fontSize: size }} onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) =>
        onChange ? (
          <button
            key={n}
            type="button"
            className={`star-btn ${n <= shown ? 'on' : ''}`}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ) : (
          <span key={n} className={n <= shown ? 'on' : ''}>★</span>
        ),
      )}
    </span>
  )
}

export default StarRating
