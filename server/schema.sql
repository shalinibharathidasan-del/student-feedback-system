-- Online Student Feedback System - database schema

CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(100) NOT NULL UNIQUE,
  usn           VARCHAR(15),
  password_hash VARCHAR(100) NOT NULL,
  role          ENUM('student', 'faculty') NOT NULL DEFAULT 'student',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  code     VARCHAR(15)  NOT NULL UNIQUE,
  name     VARCHAR(100) NOT NULL,
  faculty  VARCHAR(100) NOT NULL,
  semester TINYINT      NOT NULL
);

-- One feedback per student per course
CREATE TABLE IF NOT EXISTS feedback (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  student_id   INT NOT NULL,
  course_id    INT NOT NULL,
  rating       TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comments     TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY one_feedback (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (course_id)  REFERENCES courses(id) ON DELETE CASCADE
);
