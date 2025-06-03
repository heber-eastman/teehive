import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { apiKeyAuth } from '../middleware/apiKeyAuth';

const router = Router();

/**
 * @route GET /v1/tee-times
 * @desc Get all tee times
 * @access Protected (API Key)
 */
router.get('/', apiKeyAuth, async (req, res) => {
  try {
    const teeTimes = await prisma.teeTime.findMany({
      orderBy: {
        dateTime: 'asc'
      }
    });
    res.json(teeTimes);
  } catch (error) {
    console.error('Error fetching tee times:', error);
    res.status(500).json({ error: 'Failed to fetch tee times' });
  }
});

export default router; 