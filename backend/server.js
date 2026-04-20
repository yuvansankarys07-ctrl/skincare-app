const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from the backend directory so running from project root still works
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Validate required environment variables early
if (!process.env.MONGO_URI) {
  console.warn('Warning: MONGO_URI not set. Falling back to local MongoDB.');
}
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET not set. Authentication will fail for token actions.');
}

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const isViteDevOrigin = /^http:\/\/(localhost|127\.0\.0\.1):517\d$/.test(origin);
    if (allowedOrigins.includes(origin) || isViteDevOrigin) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/skincare';
mongoose.set('strictQuery', false);
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// More detailed mongoose connection events
mongoose.connection.on('connected', () => console.log('Mongoose connected to', mongoUri));
mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.warn('Mongoose disconnected'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

app.get('/', (req, res) => {
  res.send('Skincare Backend API');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});
const PORT = process.env.PORT || 5000;
// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = () => {
  console.log('Shutting down server...');
  server.close(() => {
    // mongoose.connection.close no longer accepts a callback in recent versions
    mongoose.connection.close(false)
      .then(() => {
        console.log('Mongo connection closed. Exiting.');
        process.exit(0);
      })
      .catch((err) => {
        console.error('Error closing Mongo connection during shutdown:', err);
        process.exit(1);
      });
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);