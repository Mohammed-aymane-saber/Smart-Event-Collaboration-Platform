const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

let pool;
try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'events_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
} catch (error) {
  console.error("Database connection failed:", error);
}

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// GET /events/:id/comments
app.get('/events/:id/comments', authMiddleware, async (req, res) => {
  try {
    const eventId = req.params.id;
    const [rows] = await pool.execute(
      'SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE event_id = ? ORDER BY created_at DESC',
      [eventId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /events/:id/comments
app.post('/events/:id/comments', authMiddleware, async (req, res) => {
  try {
    const eventId = req.params.id;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const [result] = await pool.execute(
      'INSERT INTO comments (event_id, user_id, text) VALUES (?, ?, ?)',
      [eventId, req.user.id, text]
    );

    res.status(201).json({ message: 'Comment added', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Interaction Service running on port ${PORT}`);
});
