import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function generateApiKey() {
  try {
    const apiKey = `tk_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
    
    const createdKey = await prisma.apiKey.create({
      data: {
        key: apiKey,
      },
    });

    console.log('API Key created successfully:', createdKey);
  } catch (error) {
    console.error('Error creating API key:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateApiKey(); 