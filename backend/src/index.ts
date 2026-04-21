import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './config';
import routes from './routes';
import { errorHandler, notFound } from './middlewares/error';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();

// ============================================
// MIDDLEWARES
// ============================================

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// ============================================
// ROUTES
// ============================================

app.use('/api', routes);

// ============================================
// ERROR HANDLING
// ============================================

app.use(notFound);
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

const PORT = config.port;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 PPDB Backend Server');
  console.log('='.repeat(50));
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log('='.repeat(50));
});

export default app;