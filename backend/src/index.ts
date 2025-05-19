import express from 'express';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Load environment variables
config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
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