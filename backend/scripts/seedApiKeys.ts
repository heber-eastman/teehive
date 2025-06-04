import { prisma } from '../src/lib/prisma';

async function seedApiKeys() {
  try {
    // Clear existing API keys
    await prisma.apiKey.deleteMany();

    // Create a new API key
    const apiKey = await prisma.apiKey.create({
      data: {
        key: 'teehive-public-key-2024'
      }
    });

    console.log('✅ Successfully seeded API key');
    console.log('API Key:', apiKey.key);
  } catch (error) {
    console.error('Error seeding API keys:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedApiKeys(); 