import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';

// Create a test app instance
const app = express();
const prisma = new PrismaClient();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

describe('Health Endpoint', () => {
  it('should return 200 and status ok', async () => {
    const response = await request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({ status: 'ok' });
  });
}); 