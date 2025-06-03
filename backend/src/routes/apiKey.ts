import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { isAuthenticated } from '../auth';
import { prisma } from '../lib/prisma';

const router = express.Router();

// Get all API keys
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const apiKeys = await prisma.apiKey.findMany();
    res.json(apiKeys);
  } catch (err) {
    console.error('Error fetching API keys:', err);
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
});

// Create new API key
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const apiKeyData: Prisma.ApiKeyCreateInput = {
      key: generateApiKey(),
    };

    const apiKey = await prisma.apiKey.create({
      data: apiKeyData,
    });

    res.status(201).json(apiKey);
  } catch (err) {
    console.error('Error creating API key:', err);
    res.status(500).json({ error: 'Failed to create API key' });
  }
});

// Delete API key
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.apiKey.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting API key:', err);
    res.status(500).json({ error: 'Failed to delete API key' });
  }
});

// Helper function to generate API key
function generateApiKey(): string {
  return `tk_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
}

export default router; 