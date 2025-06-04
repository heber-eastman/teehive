import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createApiKey() {
  try {
    // Delete any existing API keys
    await prisma.apiKey.deleteMany();
    
    // Create new API key
    const apiKey = await prisma.apiKey.create({
      data: {
        key: 'tk_zlvc2avtg3ambhc07eq'
      }
    });
    
    console.log('API key created successfully:', apiKey);
  } catch (error) {
    console.error('Error creating API key:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createApiKey(); 