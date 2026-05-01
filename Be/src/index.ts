import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/connection';
import { config } from './config';
import authRoutes from './routes/auth';
import creatorRoutes from './routes/creator';
import tipRoutes from './routes/tips';
import { requestLogger, errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/creator', creatorRoutes);
app.use('/api/tips', tipRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(config.PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${config.PORT}`);
  console.log(`📝 API Documentation:`);
  console.log(`   - Auth: POST /api/auth/register, /api/auth/login`);
  console.log(`   - Creator: GET/POST /api/creator/*`);
  console.log(`   - Tips: GET/POST /api/tips/*`);
  console.log(`🔗 MongoDB: ${config.MONGO_URI}`);
});
