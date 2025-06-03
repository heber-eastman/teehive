import request from 'supertest';
import { prisma, testData } from './setup';

describe('API Key Endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    testData.apiKey = null;
  });

  it('should return 500 when no API key is found in database', async () => {
    const { app } = require('../src/index');
    testData.apiKey = null;
    const response = await request(app)
      .get('/v1/public/api-key')
      .expect('Content-Type', /json/)
      .expect(500);

    expect(response.body).toHaveProperty('error', 'No API key found in database');
  });

  it('should return API key when found in database', async () => {
    const { app } = require('../src/index');
    const mockApiKey = {
      id: 'test-key',
      key: 'test-api-key',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    testData.apiKey = mockApiKey;
    const response = await request(app)
      .get('/v1/public/api-key')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('apiKey');
    // The API key is hashed before being returned
    expect(response.body.apiKey).toMatch(/^[a-f0-9]{64}$/);
  });
}); 