import request from 'supertest';
import express from 'express';
import publicRoutes from '../src/routes/public';

describe('API Key Endpoint', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use('/v1/public', publicRoutes);
  });

  it('should return 500 if API_KEY is not configured', async () => {
    const response = await request(app)
      .get('/v1/public/api-key')
      .expect('Content-Type', /json/)
      .expect(500);

    expect(response.body).toEqual({ error: 'API key not configured' });
  });

  it('should return API key when configured', async () => {
    const testApiKey = 'test-api-key-123';
    process.env.API_KEY = testApiKey;

    const response = await request(app)
      .get('/v1/public/api-key')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({ apiKey: testApiKey });
  });
}); 