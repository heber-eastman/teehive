import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function rotateApiKey() {
  try {
    // Generate a random 32-character string
    const newKey = crypto.randomBytes(32).toString('hex');

    // Upsert the API key
    const apiKey = await prisma.apiKey.upsert({
      where: {
        // Use a constant ID to ensure we only have one record
        id: 'default-api-key',
      },
      update: {
        key: newKey,
      },
      create: {
        id: 'default-api-key',
        key: newKey,
      },
    });

    console.log('API key rotated successfully');
    console.log('New key:', apiKey.key);
  } catch (error) {
    console.error('Failed to rotate API key:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the rotation
rotateApiKey(); 