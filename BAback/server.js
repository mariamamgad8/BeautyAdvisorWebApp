require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('./generated/prisma');
const authRoutes = require('./routes/auth');
const imageRoutes = require('./routes/images');
const recommendationRoutes = require('./routes/recommendations');
const feedbackRoutes = require('./routes/feedback');
const { ensureDirectories } = require('./utils/ensureDirs');

// Ensure required directories exist
ensureDirectories();

const app = express();
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Test database connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the database');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

testConnection();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.use('/auth', authRoutes);
apiRouter.use('/images', imageRoutes);
apiRouter.use('/recommendations', recommendationRoutes);
apiRouter.use('/feedback', feedbackRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Beauty Advisor API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('exit', async () => {
  await prisma.$disconnect();
});