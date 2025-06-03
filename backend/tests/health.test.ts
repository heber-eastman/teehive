import request from 'supertest';
import { app } from '../src/index';

describe('Health Endpoint', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      PORT: '3001', // Use a different port for tests
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return 200 OK with status message', async () => {
    const response = await request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({ status: 'ok' });
  });
}); 