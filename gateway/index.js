const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const AUTH_URL = process.env.AUTH_URL || 'http://localhost:3001';
const EVENT_URL = process.env.EVENT_URL || 'http://localhost:3002';
const INTERACTION_URL = process.env.INTERACTION_URL || 'http://localhost:3003';

const createProxyRoute = (targetUrl) => {
  return async (req, res) => {
    try {
      const response = await axios({
        method: req.method,
        url: `${targetUrl}${req.originalUrl.replace('/api', '')}`,
        data: req.body,
        headers: {
          ...req.headers,
          host: new URL(targetUrl).host
        }
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: 'Gateway Proxy Error' });
      }
    }
  };
};

// Routes
// Auth service
app.use('/api/login', createProxyRoute(AUTH_URL));
app.use('/api/register', createProxyRoute(AUTH_URL));

// Events service
// Using a specific matching for events routes since interaction routes also start with /api/events/:id/comments
app.use('/api/events/:id/comments', createProxyRoute(INTERACTION_URL));
app.use('/api/events', createProxyRoute(EVENT_URL));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
