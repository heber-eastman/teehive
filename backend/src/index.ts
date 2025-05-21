// Load environment variables first
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPath = path.resolve(__dirname, '..', '.env');
console.log('Loading .env from:', envPath);
console.log('File exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  const result = config({ path: envPath });
  console.log('Dotenv config result:', result);
}

// Force reload environment variables
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
process.env.SESSION_SECRET = process.env.SESSION_SECRET;
process.env.DATABASE_URL = process.env.DATABASE_URL;
process.env.PORT = process.env.PORT;

import express from 'express';
import { PrismaClient } from '@prisma/client';
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
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(session(sessionConfig));
app.use(passport.initialize());
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
app.use('/', adminRouter);

// Mount public routes
app.use('/v1/public', publicRouter);

// Mount tee times routes
app.use('/v1/tee-times', teeTimesRouter);

// Add test endpoint for CSV upload
app.post('/api/test/csv-upload', upload.single('file'), async (req, res) => {
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

startServer(); 