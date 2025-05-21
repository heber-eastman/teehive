import { Router } from 'express';

const router = Router();

/**
 * @route GET /v1/public/api-key
 * @desc Get the public API key
 * @access Public
 */
router.get('/api-key', (req, res) => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  res.json({ apiKey });
});

export default router; 