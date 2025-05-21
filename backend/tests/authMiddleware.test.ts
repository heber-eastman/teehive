import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { apiKeyAuth } from '../src/middleware/apiKeyAuth';
import crypto from 'crypto';

const prisma = new PrismaClient();

describe('API Key Authentication Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(async () => {
    // Clean up the ApiKey table before each test
    await prisma.apiKey.deleteMany();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return 401 if no authorization header is present', async () => {
    mockRequest.headers = {};
    
    await apiKeyAuth(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'API key is required' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header format is invalid', async () => {
    mockRequest.headers = {
      authorization: 'InvalidFormat'
    };
    
    await apiKeyAuth(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ 
      error: 'Invalid authorization format. Use: Bearer <api-key>' 
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 if API key is invalid', async () => {
    mockRequest.headers = {
      authorization: 'Bearer invalid-key'
    };
    
    await apiKeyAuth(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid API key' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should call next() if API key is valid', async () => {
    // Create a valid API key in the database
    const validKey = crypto.randomBytes(32).toString('hex');
    await prisma.apiKey.create({
      data: {
        id: 'test-key',
        key: validKey,
      },
    });

    mockRequest.headers = {
      authorization: `Bearer ${validKey}`
    };
    
    await apiKeyAuth(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.apiKey).toBe(validKey);
  });
}); 