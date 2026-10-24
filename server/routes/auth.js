// Student authentication: sign up and login (faculty accounts are created by init-db)
const express = require('express')
const bcrypt = require('bcryptjs')
const pool = require('../db')
const { signToken, requireLogin } = require('../middleware/auth')

const router = express.Router()

const publicUser = ({ id, name, email, usn, role }) => ({ id, name, email, usn, role })

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, usn, password } = req.body
  if (!name?.trim() || !email?.trim() || !usn?.trim() || !password) {
    return res.status(400).json({ error: 'Name, email, USN and password are required' })
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email' })
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })

  const cleanEmail = email.trim().toLowerCase()
  const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [cleanEmail])
  if (existing.length) return res.status(409).json({ error: 'An account with this email already exists' })

  const hash = await bcrypt.hash(password, 10)
  const [result] = await pool.execute(
    "INSERT INTO users (name, email, usn, password_hash, role) VALUES (?, ?, ?, ?, 'student')",
    [name.trim(), cleanEmail, usn.trim().toUpperCase(), hash],
  )
  const user = { id: result.insertId, name: name.trim(), email: cleanEmail, usn: usn.trim().toUpperCase(), role: 'student' }
  res.status(201).json({ token: signToken(user), user: publicUser(user) })
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const [[user]] = await pool.execute('SELECT * FROM users WHERE email = ?', [(email || '').trim().toLowerCase()])
  if (!user || !(await bcrypt.compare(password || '', user.password_hash))) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  res.json({ token: signToken(user), user: publicUser(user) })
})

// GET /api/auth/me
router.get('/me', requireLogin, async (req, res) => {
  const [[user]] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.user.id])
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(publicUser(user))
})

module.exports = router
