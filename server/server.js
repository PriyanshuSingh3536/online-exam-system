require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// ===== DATABASE CONNECTION =====
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
    return;
  }
  console.log("MySQL connected successfully!");
});

// ===== AUTH APIS =====

app.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role || "student"],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User registered successfully!" });
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ error: "User not found!" });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Wrong password!" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ message: "Login successful!", token, role: user.role, userId: user.id, name: user.name });
  });
});

// ===== EXAM APIS =====

app.post("/exam/create", (req, res) => {
  const { title, description, duration, created_by } = req.body;
  db.query(
    "INSERT INTO exams (title, description, duration, created_by) VALUES (?, ?, ?, ?)",
    [title, description, duration, created_by],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Exam created!", examId: result.insertId });
    }
  );
});

app.post("/exam/questions", (req, res) => {
  const { exam_id, questions } = req.body;
  const values = questions.map((q) => [
    exam_id,
    q.question,
    q.option_a,
    q.option_b,
    q.option_c,
    q.option_d,
    q.correct_answer,
  ]);
  db.query(
    "INSERT INTO questions (exam_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES ?",
    [values],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Questions added!" });
    }
  );
});

app.get("/exams", (req, res) => {
  db.query("SELECT * FROM exams", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/exam/:id", (req, res) => {
  const examId = req.params.id;
  db.query("SELECT * FROM exams WHERE id = ?", [examId], (err, exam) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query("SELECT * FROM questions WHERE exam_id = ?", [examId], (err, questions) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ exam: exam[0], questions });
    });
  });
});

app.post("/result/save", (req, res) => {
  const { exam_id, user_id, score, total, violations } = req.body;
  db.query(
    "INSERT INTO results (exam_id, user_id, score, total, violations) VALUES (?, ?, ?, ?, ?)",
    [exam_id, user_id, score, total, violations],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Result saved!" });
    }
  );
});

app.get("/results", (req, res) => {
  db.query(
    `SELECT r.*, u.name, u.email, e.title 
     FROM results r 
     JOIN users u ON r.user_id = u.id 
     JOIN exams e ON r.exam_id = e.id
     ORDER BY r.created_at DESC`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

app.get("/results/user/:userId", (req, res) => {
  db.query(
    `SELECT r.*, e.title 
     FROM results r 
     JOIN exams e ON r.exam_id = e.id 
     WHERE r.user_id = ?
     ORDER BY r.created_at DESC`,
    [req.params.userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

app.get("/check-attempt/:examId/:userId", (req, res) => {
  const { examId, userId } = req.params;
  db.query(
    "SELECT * FROM results WHERE exam_id = ? AND user_id = ?",
    [examId, userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ attempted: results.length > 0 });
    }
  );
});

app.delete("/exam/:id", (req, res) => {
  const examId = req.params.id;
  db.query("DELETE FROM questions WHERE exam_id = ?", [examId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query("DELETE FROM exams WHERE id = ?", [examId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Exam deleted!" });
    });
  });
});

app.get("/", (req, res) => {
  res.send("Online Exam Backend Running");
});

app.listen(process.env.PORT || 5050, () => {
  console.log(`Server running on port ${process.env.PORT || 5050}`);
});