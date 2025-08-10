// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan'); // optional, nice for logging
require('dotenv').config();

const propertyRoutes = require('./routes/propertyRoute');
const userRoutes = require('./routes/userRoute');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists (dev only)
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log('Created uploads directory at', UPLOADS_DIR);
}

// set up CORS origins from env or defaults
const allowedOrigins = [
  'http://localhost:3000',
  // Add your deployed frontend urls here or via env var
  ...(process.env.FRONTEND_URLS ? process.env.FRONTEND_URLS.split(',') : []),
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: origin not allowed'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan('dev')); // optional, remove if you don't want logs

// body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));

// api routes
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Backend working!');
});

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not set in .env');
    }
    await mongoose.connect(process.env.MONGO_URI, {
      // use the defaults for modern mongoose
    });
    console.log('MongoDB is connected');

    app.listen(PORT, () => {
      console.log(`Server is running at port: ${PORT}`);
    });
  } catch (err) {
    console.error('Error connecting to MongoDB.', err.message);
    process.exit(1);
  }
};

startServer();

// graceful shutdown logging (optional)
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('SIGINT', () => {
  console.log('SIGINT received — shutting down');
  process.exit(0);
});
