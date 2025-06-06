import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import { User } from './types';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

// Debug environment variables
console.log('Environment variables in auth.ts:', {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET,
  DATABASE_URL: process.env.DATABASE_URL ? 'exists' : 'undefined',
  PORT: process.env.PORT
});

// Session configuration
export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
};

// Passport configuration
export function configurePassport() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Google OAuth credentials are not configured');
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        // Store only the email in the session
        const user: User = {
          email: profile.emails?.[0]?.value || '',
        };
        return done(null, user);
      }
    )
  );

  passport.serializeUser((user: User, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: User, done) => {
    done(null, user);
  });
}

// Auth middleware to check if user is authenticated
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Invalid authorization format' });
    }

    const apiKey = await prisma.apiKey.findFirst({
      where: { key: token }
    });

    if (!apiKey) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
}; 