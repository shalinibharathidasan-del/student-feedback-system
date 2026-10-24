// Course list for course selection
const express = require('express')
const pool = require('../db')
const { requireRole } = require('../middleware/auth')

const router = express.Router()

// GET /api/courses  (student: includes whether they already gave feedback)
router.get('/', requireRole('student'), async (req, res) => {
  const [courses] = await pool.execute(
    `SELECT c.*, f.id IS NOT NULL AS submitted
     FROM courses c LEFT JOIN feedback f ON f.course_id = c.id AND f.student_id = ?
     ORDER BY c.code`,
    [req.user.id],
  )
  res.json(courses.map((c) => ({ ...c, submitted: Boolean(c.submitted) })))
})

// GET /api/courses/:id
router.get('/:id', requireRole('student'), async (req, res) => {
  const [[course]] = await pool.execute('SELECT * FROM courses WHERE id = ?', [req.params.id])
  if (!course) return res.status(404).json({ error: 'Course not found' })
  res.json(course)
})

module.exports = router
