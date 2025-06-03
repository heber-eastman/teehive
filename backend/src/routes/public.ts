import { Router } from 'express';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';

const router = Router();

/**
 * @route GET /v1/public/api-key
 * @desc Get the public API key
 * @access Public
 */
router.get('/api-key', async (req, res) => {
  try {
    const apiKey = await prisma.apiKey.findFirst();
    
    if (!apiKey) {
      return res.status(500).json({ error: 'No API key found in database' });
    }

    // Hash the API key before returning it
    const hashedKey = crypto.createHash('sha256').update(apiKey.key).digest('hex');
    res.json({ apiKey: hashedKey });
  } catch (error) {
    console.error('Error fetching API key:', error);
    res.status(500).json({ error: 'Failed to fetch API key' });
  }
});

export default router; 