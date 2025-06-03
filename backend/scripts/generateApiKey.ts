import { prisma } from '../src/lib/prisma';
import crypto from 'crypto';

async function generateApiKey() {
  try {
    // Generate a random API key
    const apiKey = crypto.randomBytes(32).toString('hex');

    // Store the API key in the database
    await prisma.apiKey.create({
      data: {
        key: apiKey
      }
    });

    console.log('✅ API key generated successfully:');
    console.log(apiKey);
  } catch (error) {
    console.error('Error generating API key:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateApiKey(); 