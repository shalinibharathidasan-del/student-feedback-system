// Creates the database and tables, then adds demo users, courses and sample feedback.
// Run once: npm run init-db
const fs = require('fs')
const path = require('path')
const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')

const DB_NAME = process.env.DB_NAME || 'feedback_system'

// Demo logins for trying the app locally (also listed in README)
const DEMO_USERS = [
  { name: 'Dr. Kavya Menon', email: 'faculty@college.edu', password: 'faculty123', role: 'faculty' },
  { name: 'Ananya Rao', email: 'ananya@college.edu', password: 'student123', role: 'student', usn: '1DS24MC001' },
  { name: 'Rahul Kumar', email: 'rahul@college.edu', password: 'student123', role: 'student', usn: '1DS24MC002' },
  { name: 'Priya Sharma', email: 'priya@college.edu', password: 'student123', role: 'student', usn: '1DS24MC003' },
]

const COURSES = [
  ['MMCA314D', 'Web Development using Full Stack Open', 'Dr. Kavya Menon', 3],
  ['MMCA301', 'Machine Learning', 'Prof. S. Raghavan', 3],
  ['MMCA302', 'Cloud Computing', 'Dr. Arjun Iyer', 3],
  ['MMCA303', 'Data Analytics with Python', 'Prof. Neha Kulkarni', 3],
  ['MMCA304', 'Software Testing', 'Dr. Meera Das', 3],
]

// [student email, course code, rating, comment] - so the faculty view has data to show
const SAMPLE_FEEDBACK = [
  ['rahul@college.edu', 'MMCA314D', 5, 'Hands-on projects made React and Node.js easy to understand.'],
  ['priya@college.edu', 'MMCA314D', 4, 'Great course. More time for MySQL would help.'],
  ['rahul@college.edu', 'MMCA301', 3, 'Good theory but needs more practical examples.'],
  ['priya@college.edu', 'MMCA302', 4, 'AWS demo sessions were very useful.'],
]

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  })

  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``)
  await conn.changeUser({ database: DB_NAME })
  await conn.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'))
  console.log(`Database "${DB_NAME}" and tables ready`)

  for (const u of DEMO_USERS) {
    const hash = await bcrypt.hash(u.password, 10)
    await conn.execute('INSERT IGNORE INTO users (name, email, usn, password_hash, role) VALUES (?, ?, ?, ?, ?)', [
      u.name, u.email, u.usn || null, hash, u.role,
    ])
  }
  await conn.query('INSERT IGNORE INTO courses (code, name, faculty, semester) VALUES ?', [COURSES])

  for (const [email, code, rating, comments] of SAMPLE_FEEDBACK) {
    await conn.execute(
      `INSERT IGNORE INTO feedback (student_id, course_id, rating, comments)
       SELECT u.id, c.id, ?, ? FROM users u, courses c WHERE u.email = ? AND c.code = ?`,
      [rating, comments, email, code],
    )
  }
  console.log('Demo data added. Logins: faculty@college.edu / faculty123, ananya@college.edu / student123')
  await conn.end()
}

main().catch((err) => {
  console.error('Setup failed:', err.sqlMessage || err.message)
  process.exit(1)
})
