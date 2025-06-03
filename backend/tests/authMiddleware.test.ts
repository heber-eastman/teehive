// Mock PrismaClient before any other imports
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    apiKey: {
      findFirst: jest.fn().mockResolvedValue(null),
    },
    $disconnect: jest.fn(),
  })),
}));

import { Request, Response, NextFunction } from 'express';
import { apiKeyAuth } from '../src/middleware/apiKeyAuth';
import crypto from 'crypto';
import request from 'supertest';
import { prisma, testData } from './setup';

const { PrismaClient } = require('@prisma/client');

describe('API Key Authentication Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
    testData.apiKey = null;
  });

  it('should return 401 if no authorization header is present', async () => {
    const { app } = require('../src/index');
    const response = await request(app)
      .get('/v1/admin/tee-times')
      .expect(401);

    expect(response.body).toHaveProperty('error', 'No authorization header');
  });

  it('should return 401 if authorization header is not in Bearer format', async () => {
    const { app } = require('../src/index');
    const response = await request(app)
      .get('/v1/admin/tee-times')
      .set('Authorization', 'InvalidFormat')
      .expect(401);

    expect(response.body).toHaveProperty('error', 'Invalid authorization format');
  });

  it('should return 401 if API key is invalid', async () => {
    const { app } = require('../src/index');
    testData.apiKey = null;
    const response = await request(app)
      .get('/v1/admin/tee-times')
      .set('Authorization', 'Bearer invalid-key')
      .expect(401);

    expect(response.body).toHaveProperty('error', 'Invalid API key');
  });

  it('should call next() if API key is valid', async () => {
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

describe('Auth Middleware Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    testData.apiKey = null;
  });

  it('should return 401 when no API key is provided', async () => {
    const { app } = require('../src/index');
    const response = await request(app)
      .get('/v1/tee-times')
      .set('Authorization', '');
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 401 when invalid API key is provided', async () => {
    const { app } = require('../src/index');
    testData.apiKey = null;
    const response = await request(app)
      .get('/v1/tee-times')
      .set('Authorization', 'Bearer invalid-key');
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 200 when valid API key is provided', async () => {
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
      .get('/v1/tee-times')
      .set('Authorization', `Bearer ${validKey}`);
    expect(response.status).toBe(200);
  });
}); 