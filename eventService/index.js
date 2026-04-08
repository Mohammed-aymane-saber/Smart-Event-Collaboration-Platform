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

// GET /events
app.get('/events', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM events ORDER BY event_date DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /events
app.post('/events', authMiddleware, async (req, res) => {
  try {
    const { title, description, event_date } = req.body;
    if (!title || !event_date) return res.status(400).json({ message: 'Missing fields' });

    const [result] = await pool.execute(
      'INSERT INTO events (title, description, event_date, author_id) VALUES (?, ?, ?, ?)',
      [title, description || '', event_date, req.user.id]
    );

    res.status(201).json({ message: 'Event created', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /events/:id
app.get('/events/:id', authMiddleware, async (req, res) => {
  try {
    const eventId = req.params.id;
    const [events] = await pool.execute('SELECT * FROM events WHERE id = ?', [eventId]);
    if (events.length === 0) return res.status(404).json({ message: 'Event not found' });
    
    // get participations
    const [participants] = await pool.execute(
      'SELECT users.id, users.username FROM participations JOIN users ON participations.user_id = users.id WHERE event_id = ?',
      [eventId]
    );

    res.json({ event: events[0], participants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /events/:id/join
app.post('/events/:id/join', authMiddleware, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const [existing] = await pool.execute(
      'SELECT * FROM participations WHERE user_id = ? AND event_id = ?',
      [userId, eventId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Already joined this event' });
    }

    await pool.execute(
      'INSERT INTO participations (user_id, event_id) VALUES (?, ?)',
      [userId, eventId]
    );

    res.status(201).json({ message: 'Successfully joined the event' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Event Service running on port ${PORT}`);
});
