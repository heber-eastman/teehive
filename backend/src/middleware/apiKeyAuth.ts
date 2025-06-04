import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

// Extend Express Request type to include apiKey
declare global {
  namespace Express {
    interface Request {
      apiKey?: string;
    }
  }
}

export const apiKeyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the API key from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'API key is required' });
    }

    // Check if the header is in the correct format (Bearer <key>)
    const [bearer, apiKey] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !apiKey) {
      return res.status(401).json({ error: 'Invalid authorization format. Use: Bearer <api-key>' });
    }

    // Check if the API key exists in the database
    const validKey = await prisma.apiKey.findFirst({
      where: { key: apiKey }
    });

    if (!validKey) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Add the API key to the request object for potential future use
    req.apiKey = apiKey;
    next();
  } catch (error) {
    console.error('API key authentication error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
}; 