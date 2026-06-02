require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");
const crypto = require("crypto");

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors({
  origin: process.env.FRONTEND_URL || "*"
}));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      [name, email, hashedPassword, role || "student"]
    );
    res.json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found!" });

    const user = result.rows[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Wrong password!" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ message: "Login successful!", token, role: user.role, userId: user.id, name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== FORGOT PASSWORD =====
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Email not found!" });

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000);

    await pool.query(
      "UPDATE users SET reset_token = $1, reset_expiry = $2 WHERE email = $3",
      [token, expiry, email]
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await resend.emails.send({
      from: "ProctorExam <onboarding@resend.dev>",
      to: email,
      subject: "ProctorExam - Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #667eea;">ProctorExam Password Reset</h2>
          <p>Aapne password reset request ki hai.</p>
          <a href="${resetLink}" style="background: #667eea; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #888; font-size: 13px;">Yeh link 1 hour mein expire ho jayega.</p>
          <p style="color: #888; font-size: 13px;">Agar aapne request nahi ki toh ignore karein.</p>
        </div>
      `
    });

    res.json({ message: "Reset link sent to your email!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== RESET PASSWORD =====
app.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE reset_token = $1 AND reset_expiry > NOW()",
      [token]
    );
    if (result.rows.length === 0)
      return res.status(400).json({ error: "Invalid or expired token!" });

    const hashedPassword = bcrypt.hashSync(password, 10);
    await pool.query(
      "UPDATE users SET password = $1, reset_token = NULL, reset_expiry = NULL WHERE reset_token = $2",
      [hashedPassword, token]
    );

    res.json({ message: "Password reset successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/exam/create", async (req, res) => {
  const { title, description, duration, created_by } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO exams (title, description, duration, created_by) VALUES ($1, $2, $3, $4) RETURNING id",
      [title, description, duration, created_by]
    );
    res.json({ message: "Exam created!", examId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/exam/questions", async (req, res) => {
  const { exam_id, questions } = req.body;
  try {
    for (const q of questions) {
      await pool.query(
        "INSERT INTO questions (exam_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [exam_id, q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer]
      );
    }
    res.json({ message: "Questions added!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/exams", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM exams");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/exam/:id", async (req, res) => {
  const examId = req.params.id;
  try {
    const exam = await pool.query("SELECT * FROM exams WHERE id = $1", [examId]);
    const questions = await pool.query("SELECT * FROM questions WHERE exam_id = $1", [examId]);
    res.json({ exam: exam.rows[0], questions: questions.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/result/save", async (req, res) => {
  const { exam_id, user_id, score, total, violations } = req.body;
  try {
    await pool.query(
      "INSERT INTO results (exam_id, user_id, score, total, violations) VALUES ($1, $2, $3, $4, $5)",
      [exam_id, user_id, score, total, violations]
    );
    res.json({ message: "Result saved!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/results", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.name, u.email, e.title 
       FROM results r 
       JOIN users u ON r.user_id = u.id 
       JOIN exams e ON r.exam_id = e.id
       ORDER BY r.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/results/user/:userId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, e.title 
       FROM results r 
       JOIN exams e ON r.exam_id = e.id 
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/check-attempt/:examId/:userId", async (req, res) => {
  const { examId, userId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM results WHERE exam_id = $1 AND user_id = $2",
      [examId, userId]
    );
    res.json({ attempted: result.rows.length > 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/exam/:id", async (req, res) => {
  const examId = req.params.id;
  try {
    await pool.query("DELETE FROM questions WHERE exam_id = $1", [examId]);
    await pool.query("DELETE FROM exams WHERE id = $1", [examId]);
    res.json({ message: "Exam deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Online Exam Backend Running");
});

app.listen(process.env.PORT || 5050, () => {
  console.log(`Server running on port ${process.env.PORT || 5050}`);
});