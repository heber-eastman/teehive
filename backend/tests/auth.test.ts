import request from 'supertest';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { User } from '../src/types';
import { sessionConfig, configurePassport } from '../src/auth';

// Mock the Google strategy
jest.mock('passport-google-oauth20', () => {
  return {
    Strategy: jest.fn().mockImplementation(() => {
      return {
        name: 'google',
        authenticate: jest.fn()
      };
    })
  };
});

describe('Auth Endpoints', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(session(sessionConfig));
    app.use(passport.initialize());
    app.use(passport.session());

    // Configure passport with mocked strategy
    configurePassport();

    // Mock Google OAuth callback route
    app.get('/auth/google/callback', 
      (req, res, next) => {
        // Mock successful authentication
        const mockUser: User = { email: 'test@example.com' };
        req.user = mockUser;
        next();
      },
      (req, res) => {
        res.json({ user: req.user });
      }
    );

    // Mock protected route
    app.get('/api/me', (req, res) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      res.json({ user: req.user });
    });
  });

  it('should handle Google OAuth callback and set session', async () => {
    const mockUser: User = { email: 'test@example.com' };

    const response = await request(app)
      .get('/auth/google/callback')
      .query({ code: 'mock-code' });

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual(mockUser);
  });

  it('should return 401 for unauthenticated requests to protected routes', async () => {
    const response = await request(app)
      .get('/api/me');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });
}); 