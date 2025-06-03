import { config } from 'dotenv';
import { resolve } from 'path';
import passport from 'passport';
import { PrismaClient } from '@prisma/client';

// Load environment variables from .env.development
config({ path: resolve(__dirname, '../.env.development') });

// In-memory store for test data
const testData = {
  apiKey: null,
  teeTimes: [],
  uploadLogs: []
};

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  class MockPrismaClient {
    apiKey = {
      findFirst: jest.fn().mockImplementation(() => Promise.resolve(testData.apiKey)),
      findUnique: jest.fn().mockImplementation(() => Promise.resolve(testData.apiKey)),
      create: jest.fn().mockImplementation((data) => {
        testData.apiKey = { ...data.data, id: 'test-key' };
        return Promise.resolve(testData.apiKey);
      }),
      update: jest.fn().mockImplementation((data) => {
        testData.apiKey = { ...data.data, id: 'test-key' };
        return Promise.resolve(testData.apiKey);
      }),
      delete: jest.fn().mockImplementation(() => {
        testData.apiKey = null;
        return Promise.resolve({ id: 'test-key' });
      }),
      deleteMany: jest.fn().mockImplementation(() => {
        testData.apiKey = null;
        return Promise.resolve({ count: 1 });
      }),
      createMany: jest.fn().mockImplementation((data) => {
        if (Array.isArray(data.data)) {
          testData.apiKey = data.data[data.data.length - 1];
          return Promise.resolve({ count: data.data.length });
        }
        return Promise.resolve({ count: 0 });
      }),
      upsert: jest.fn().mockImplementation((data) => {
        if (testData.apiKey && testData.apiKey.id === data.where.id) {
          testData.apiKey = { ...testData.apiKey, ...data.update };
        } else {
          testData.apiKey = { id: data.where.id, ...data.create };
        }
        return Promise.resolve(testData.apiKey);
      }),
    };
    teeTime = {
      findMany: jest.fn().mockImplementation(() => Promise.resolve(testData.teeTimes)),
      create: jest.fn().mockImplementation((data) => {
        const teeTime = { ...data.data, id: 'test-tee-time' };
        testData.teeTimes.push(teeTime);
        return Promise.resolve(teeTime);
      }),
      update: jest.fn().mockImplementation((data) => {
        const index = testData.teeTimes.findIndex(t => t.id === data.where.id);
        if (index !== -1) {
          testData.teeTimes[index] = { ...testData.teeTimes[index], ...data.data };
        }
        return Promise.resolve(testData.teeTimes[index]);
      }),
      delete: jest.fn().mockImplementation((data) => {
        const index = testData.teeTimes.findIndex(t => t.id === data.where.id);
        if (index !== -1) {
          testData.teeTimes.splice(index, 1);
        }
        return Promise.resolve({ id: 'test-tee-time' });
      }),
      deleteMany: jest.fn().mockImplementation(() => {
        const count = testData.teeTimes.length;
        testData.teeTimes = [];
        return Promise.resolve({ count });
      }),
      createMany: jest.fn().mockImplementation((data) => {
        if (Array.isArray(data.data)) {
          const newTeeTimes = data.data.map((item, idx) => ({ ...item, id: `test-tee-time-${idx}` }));
          testData.teeTimes.push(...newTeeTimes);
          return Promise.resolve({ count: newTeeTimes.length });
        }
        return Promise.resolve({ count: 0 });
      }),
    };
    uploadLog = {
      findMany: jest.fn().mockImplementation(() => Promise.resolve(testData.uploadLogs)),
      create: jest.fn().mockImplementation((data) => {
        const uploadLog = { ...data.data, id: 'test-upload-log' };
        testData.uploadLogs.push(uploadLog);
        return Promise.resolve(uploadLog);
      }),
      update: jest.fn().mockImplementation((data) => {
        const index = testData.uploadLogs.findIndex(l => l.id === data.where.id);
        if (index !== -1) {
          testData.uploadLogs[index] = { ...testData.uploadLogs[index], ...data.data };
        }
        return Promise.resolve(testData.uploadLogs[index]);
      }),
      delete: jest.fn().mockImplementation((data) => {
        const index = testData.uploadLogs.findIndex(l => l.id === data.where.id);
        if (index !== -1) {
          testData.uploadLogs.splice(index, 1);
        }
        return Promise.resolve({ id: 'test-upload-log' });
      }),
      deleteMany: jest.fn().mockImplementation(() => {
        const count = testData.uploadLogs.length;
        testData.uploadLogs = [];
        return Promise.resolve({ count });
      }),
      createMany: jest.fn().mockImplementation((data) => {
        if (Array.isArray(data.data)) {
          const newLogs = data.data.map((item, idx) => ({ ...item, id: `test-upload-log-${idx}` }));
          testData.uploadLogs.push(...newLogs);
          return Promise.resolve({ count: newLogs.length });
        }
        return Promise.resolve({ count: 0 });
      }),
    };
    $disconnect = jest.fn();
    $transaction = jest.fn().mockImplementation(async (input) => {
      if (typeof input === 'function') {
        return await input(this);
      } else if (Array.isArray(input)) {
        const results = [];
        for (const op of input) {
          results.push(await op);
        }
        return results;
      }
      return null;
    });
  }
  return {
    __esModule: true,
    PrismaClient: MockPrismaClient,
    default: { PrismaClient: MockPrismaClient },
  };
});

// Create a stateful Prisma mock
const prisma = new (require('@prisma/client').PrismaClient)();

// Mock the shared prisma import
jest.mock('../src/lib/prisma', () => ({
  prisma,
}));

// Mock the shared auth import
const authMock = function () {};
authMock.isAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Invalid authorization format' });
    }
    if (!testData.apiKey || testData.apiKey.key !== token) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Internal error in isAuthenticated mock' });
  }
};
authMock.configurePassport = jest.fn();
jest.mock('../src/auth', () => {
  console.log('>>> MOCK ../src/auth LOADED');
  return {
    __esModule: true,
    isAuthenticated: authMock.isAuthenticated,
    configurePassport: authMock.configurePassport,
    default: authMock,
  };
});

// Mock session
jest.mock('express-session', () => {
  return jest.fn(() => (req, res, next) => {
    req.session = {};
    next();
  });
});

// Mock Passport Google strategy and related methods
jest.mock('passport-google-oauth20', () => {
  return {
    Strategy: jest.fn().mockImplementation(() => {
      return {
        name: 'google',
        authenticate: (req, res, next) => {
          // Simulate successful authentication and redirect
          req.user = { id: 'test-user-id', email: 'test@example.com' };
          res.redirect('/');
        }
      };
    })
  };
}); 

// Mock passport.use to register the Google strategy in tests
(passport as any).use = jest.fn((name: string, strategy: any) => {
  // Register the strategy by name for test purposes
  (passport as any)._strategies = (passport as any)._strategies || {};
  (passport as any)._strategies[name] = strategy;
});

// Mock passport to handle authentication in tests
jest.mock('passport', () => ({
  authenticate: () => (req, res, next) => {
    req.user = { id: 'test-user-id', email: 'test@example.com' };
    next();
  },
  use: jest.fn(),
  initialize: () => (req, res, next) => next(),
  session: () => (req, res, next) => next(),
  serializeUser: jest.fn(),
  deserializeUser: jest.fn(),
}));

export { testData, prisma };

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.GOOGLE_CLIENT_ID = 'test-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
process.env.SESSION_SECRET = 'test-session-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.PORT = '3000';

// Note: express.json() middleware is already used in src/index.ts
// Note: jest.mock at the top ensures the test app uses the correct mocks 

// Mock Passport Google strategy and related methods
// describe('Mock Passport', () => {
//   beforeAll(() => {
//     jest.mock('passport', () => ({
//       authenticate: () => (req, res, next) => next(),
//       initialize: () => (req, res, next) => next(),
//       session: () => (req, res, next) => next(),
//       use: jest.fn(),
//       serializeUser: jest.fn(),
//       deserializeUser: jest.fn(),
//     }));
//   });
// }); 

// Update mock for Google OAuth strategy
jest.mock('passport-google-oauth20', () => {
  return {
    Strategy: jest.fn().mockImplementation(() => {
      return {
        name: 'google',
        authenticate: (req, res, next) => {
          // Simulate successful authentication and redirect
          req.user = { id: 'test-user-id', email: 'test@example.com' };
          res.redirect('/');
        }
      };
    })
  };
}); 

// Mock passport.use to register the Google strategy in tests
(passport as any).use = jest.fn((name: string, strategy: any) => {
  // Register the strategy by name for test purposes
  (passport as any)._strategies = (passport as any)._strategies || {};
  (passport as any)._strategies[name] = strategy;
}); 