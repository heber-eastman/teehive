// Load environment variables first
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import { prisma } from './lib/prisma';

const envPath = path.resolve(__dirname, '..', '.env');
console.log('Loading .env from:', envPath);
console.log('File exists:', fs.existsSync(envPath));

const result = config({ path: envPath });
if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
}

// Verify required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'SESSION_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'PORT'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (process.env.NODE_ENV !== 'test' && missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { sessionConfig, configurePassport, isAuthenticated } from './auth';
import { User } from './types';
import adminRouter from './admin';
import publicRouter from './routes/public';
import teeTimesRouter from './routes/teeTimes';
import multer from 'multer';
import { parseCSV, ColumnDefinition } from './utils/csvParser';

const app = express();
const port = process.env.PORT || 3000;

// Export app for testing
export { app };

// Middleware
app.use(cors());
app.use(express.json());
app.use(session(sessionConfig) as any);
app.use(passport.initialize() as any);
app.use(passport.session());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Configure Passport
configurePassport();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Define column definitions for testing
const testColumns: ColumnDefinition[] = [
  {
    name: 'name',
    validation: {
      type: 'string',
      required: true,
      pattern: /^[A-Za-z\s]+$/,
    },
  },
  {
    name: 'age',
    validation: {
      type: 'number',
      required: true,
      min: 0,
      max: 120,
    },
  },
  {
    name: 'email',
    validation: {
      type: 'string',
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },
  {
    name: 'isActive',
    validation: {
      type: 'boolean',
      required: false,
    },
  },
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Auth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Protected route example
app.get('/api/me', isAuthenticated, (req, res) => {
  const user = req.user as User;
  res.json({ email: user.email });
});

// Mount admin routes
app.use('/v1/admin', adminRouter);

// Mount public routes
app.use('/v1/public', publicRouter);

// Mount tee times routes
app.use('/v1/tee-times', teeTimesRouter);

// Add test endpoint for CSV upload
app.post('/api/test/csv-upload', (upload.single('file') as any), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await parseCSV(req.file.buffer, testColumns);
    res.json(result);
  } catch (error) {
    console.error('CSV parsing error:', error);
    res.status(500).json({ error: 'Failed to parse CSV file' });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Connect to database and start server
async function startServer() {
  try {
    // Log database URL (masked)
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL is not set in environment variables');
    }
    console.log('🔌 Database URL:', dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//****:****@'));

    await prisma.$connect();
    console.log('✅ Successfully connected to database');

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
}

// Start the server
if (process.env.NODE_ENV !== 'test') {
  startServer();
} 