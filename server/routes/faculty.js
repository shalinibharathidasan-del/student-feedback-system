// Faculty/admin view: rating summary per course and anonymous comments
const express = require('express')
const pool = require('../db')
const { requireRole } = require('../middleware/auth')

const router = express.Router()
router.use(requireRole('faculty'))

// GET /api/faculty/summary  (every course with response count, average and 1-5 star breakdown)
router.get('/summary', async (req, res) => {
  const [courses] = await pool.query(
    `SELECT c.id, c.code, c.name, c.faculty,
            COUNT(f.id) AS responses,
            ROUND(AVG(f.rating), 1) AS average,
            SUM(f.rating = 1) AS r1, SUM(f.rating = 2) AS r2, SUM(f.rating = 3) AS r3,
            SUM(f.rating = 4) AS r4, SUM(f.rating = 5) AS r5
     FROM courses c LEFT JOIN feedback f ON f.course_id = c.id
     GROUP BY c.id ORDER BY c.code`,
  )
  const [[totals]] = await pool.query(
    `SELECT COUNT(*) AS responses, ROUND(AVG(rating), 1) AS average,
            (SELECT COUNT(*) FROM users WHERE role = 'student') AS students
     FROM feedback`,
  )
  res.json({
    totals,
    courses: courses.map((c) => ({
      ...c,
      average: c.average === null ? null : Number(c.average),
      breakdown: [1, 2, 3, 4, 5].map((n) => Number(c[`r${n}`] || 0)),
    })),
  })
})

// GET /api/faculty/courses/:id/feedback  (comments without student names)
router.get('/courses/:id/feedback', async (req, res) => {
  const [[course]] = await pool.execute('SELECT * FROM courses WHERE id = ?', [req.params.id])
  if (!course) return res.status(404).json({ error: 'Course not found' })
  const [feedback] = await pool.execute(
    'SELECT id, rating, comments, submitted_at FROM feedback WHERE course_id = ? ORDER BY submitted_at DESC',
    [course.id],
  )
  res.json({ course, feedback })
})

module.exports = router
