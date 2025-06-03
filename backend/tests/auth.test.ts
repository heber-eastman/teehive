// Mocks must be at the very top
jest.mock('passport-google-oauth20', () => {
  return {
    Strategy: jest.fn().mockImplementation(() => {
      return {
        name: 'google',
        authenticate: (req, res, next) => {
          req.user = { id: 'test-user-id', email: 'test@example.com' };
          res.redirect('/');
        }
      };
    })
  };
});

import request from 'supertest';
import { prisma, testData } from './setup';

beforeEach(() => {
  jest.resetModules();
});

describe('Auth Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    testData.apiKey = null;
  });

  it('should handle Google OAuth callback and set session', async () => {
    const { app } = require('../src/index');
    const response = await request(app)
      .get('/auth/google/callback')
      .expect(302); // Expect redirect

    expect(response.header.location).toBe('/');
  });

  it('should return 401 for unauthenticated requests to protected routes', async () => {
    const { app } = require('../src/index');
    const response = await request(app)
      .get('/v1/admin/tee-times')
      .expect(401);

    expect(response.body).toHaveProperty('error');
  });

  it('should allow authenticated requests to protected routes', async () => {
    const { app } = require('../src/index');
    const validKey = 'valid-api-key';
    const mockApiKey = {
      id: 'test-key',
      key: validKey,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    testData.apiKey = mockApiKey;
    const response = await request(app)
      .get('/v1/admin/tee-times')
      .set('Authorization', `Bearer ${validKey}`)
      .expect(200);

    expect(response.body).toBeDefined();
  });
}); 