// Feedback submission (students)
const express = require('express')
const pool = require('../db')
const { requireRole } = require('../middleware/auth')

const router = express.Router()
const student = requireRole('student')

// POST /api/feedback  { course_id, rating, comments }
router.post('/', student, async (req, res) => {
  const { course_id, comments } = req.body
  const rating = Number(req.body.rating)
  if (!course_id) return res.status(400).json({ error: 'Select a course' })
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5 stars' })
  }
  if (comments && comments.length > 1000) return res.status(400).json({ error: 'Comments must be under 1000 characters' })

  const [[course]] = await pool.execute('SELECT id, name FROM courses WHERE id = ?', [course_id])
  if (!course) return res.status(404).json({ error: 'Course not found' })

  try {
    await pool.execute('INSERT INTO feedback (student_id, course_id, rating, comments) VALUES (?, ?, ?, ?)', [
      req.user.id,
      course.id,
      rating,
      comments?.trim() || null,
    ])
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'You have already submitted feedback for this course' })
    throw err
  }
  res.status(201).json({ message: `Thank you! Feedback for ${course.name} submitted.` })
})

// GET /api/feedback/my  (student's own submissions)
router.get('/my', student, async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT f.id, f.rating, f.comments, f.submitted_at, c.code, c.name, c.faculty
     FROM feedback f JOIN courses c ON c.id = f.course_id
     WHERE f.student_id = ? ORDER BY f.submitted_at DESC`,
    [req.user.id],
  )
  res.json(rows)
})

module.exports = router
