# Online Student Feedback System

MMCA314D – Web Development Using Full Stack Open — **AAT-I**

A prototype where students log in, pick a course, rate it from 1 to 5 stars, add comments and submit. Faculty see the average rating, rating breakdown and anonymous comments for every course.

**Stack:** React (Vite) · React Router · Bootstrap · Node.js · Express · MySQL · JWT · bcrypt

## Features

| Feature | Where |
|---|---|
| Student authentication (sign up / login) | `/register`, `/login` |
| Course selection | `/` (student home) – shows which courses still need feedback |
| Feedback form | `/feedback/:courseId` |
| Rating (1–5 stars) | Reusable `StarRating` component |
| Comments | Text area, up to 1000 characters |
| Submission | `POST /api/feedback` – one submission per student per course |
| Student history | `/my-feedback` |
| Faculty/admin view | `/` (faculty home) – average, breakdown, response count; `/faculty/courses/:id` – comments |

Feedback is anonymous: the faculty view shows ratings and comments without student names.

## How to run

Needs Node.js 20.6+ and MySQL 8 running.

```bash
# 1. Server
cd server
npm install
cp .env.example .env      # put your MySQL password in .env
npm run init-db           # creates database, tables, demo users, courses, sample feedback
npm start                 # http://localhost:5002/api

# 2. Client (second terminal)
cd client
npm install
npm run dev               # http://localhost:5175
```

**Demo logins** (created by `npm run init-db`):

| Role | Email | Password |
|---|---|---|
| Faculty | faculty@college.edu | faculty123 |
| Student | ananya@college.edu | student123 |

## Database design

```
users                     courses                 feedback
-----                     -------                 --------
id (PK)                   id (PK)                 id (PK)
name                      code (unique)           student_id (FK -> users.id)
email (unique)            name                    course_id  (FK -> courses.id)
usn                       faculty                 rating (1-5)
password_hash             semester                comments
role (student/faculty)                            submitted_at
created_at                                        UNIQUE (student_id, course_id)
```

## API

| Method | Endpoint | Who | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | – | Student sign up |
| POST | `/api/auth/login` | – | Login, returns JWT |
| GET | `/api/courses` | Student | Courses + whether feedback was submitted |
| GET | `/api/courses/:id` | Student | One course |
| POST | `/api/feedback` | Student | Submit rating and comments |
| GET | `/api/feedback/my` | Student | Own submissions |
| GET | `/api/faculty/summary` | Faculty | Average, breakdown, responses per course |
| GET | `/api/faculty/courses/:id/feedback` | Faculty | Anonymous comments for a course |

## Project structure

```
student-feedback-system/
├── server/
│   ├── index.js  db.js  schema.sql  init-db.js
│   ├── middleware/auth.js          JWT + role check
│   └── routes/  auth.js  courses.js  feedback.js  faculty.js
└── client/src/
    ├── App.jsx  api.js  main.jsx
    ├── context/AuthContext.jsx
    ├── components/  Navbar  StarRating  ProtectedRoute
    └── pages/  Login  Register  Courses  FeedbackForm  MyFeedback
               faculty/Dashboard  faculty/CourseFeedback
```

## Git and GitHub workflow (AAT-I Q2)

| Step | Command / action |
|---|---|
| Repository creation | Created `student-feedback-system` on GitHub |
| git init | `git init -b main` |
| git add | `git add server/...`, `git add client` |
| git commit | 3 commits for server setup, APIs and React client |
| git push | `git remote add origin ...` then `git push -u origin main` |
| Issue creation | Issue #1 "Add faculty/admin view for feedback" |
| Branch creation | `git checkout -b feature/faculty-dashboard` |
| Pull request | PR #2 `feature/faculty-dashboard` → `main` ("Closes #1") |
| Branch merging | PR #2 merged on GitHub (closes issue #1); `docs/readme` merged locally with `git merge --no-ff` |
| README creation | This file, added on the `docs/readme` branch |

```
git log --oneline --graph
*   Merge branch 'docs/readme'
|\
| * Add README with features, setup, database design and Git workflow
|/
*   Merge pull request #2 from feature/faculty-dashboard
|\
| * Add faculty dashboard and course comments pages (#1)
| * Add faculty summary and course feedback API (#1)
|/
* Add React client: login, course selection, feedback form with star rating
* Add student authentication, course and feedback APIs
* Add server setup: schema, connection pool and seed data
```
