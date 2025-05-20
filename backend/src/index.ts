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

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport
configurePassport();

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