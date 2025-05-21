import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

describe('API Key Rotation', () => {
  beforeEach(async () => {
    // Clean up the ApiKey table before each test
    await prisma.apiKey.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new API key if none exists', async () => {
    // Generate a test key
    const testKey = crypto.randomBytes(32).toString('hex');

    // Upsert the key
    const apiKey = await prisma.apiKey.upsert({
      where: {
        id: 'default-api-key',
      },
      update: {
        key: testKey,
      },
      create: {
        id: 'default-api-key',
        key: testKey,
      },
    });

    // Verify the key was created
    expect(apiKey).toBeDefined();
    expect(apiKey.key).toBe(testKey);
    expect(apiKey.id).toBe('default-api-key');

    // Verify we can retrieve it
    const retrievedKey = await prisma.apiKey.findUnique({
      where: { id: 'default-api-key' },
    });
    expect(retrievedKey).toBeDefined();
    expect(retrievedKey?.key).toBe(testKey);
  });

  it('should update existing API key', async () => {
    // Create initial key
    const initialKey = crypto.randomBytes(32).toString('hex');
    await prisma.apiKey.create({
      data: {
        id: 'default-api-key',
        key: initialKey,
      },
    });

    // Generate new key
    const newKey = crypto.randomBytes(32).toString('hex');

    // Update the key
    const updatedKey = await prisma.apiKey.upsert({
      where: {
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

    // Verify the key was updated
    expect(updatedKey.key).toBe(newKey);
    expect(updatedKey.key).not.toBe(initialKey);

    // Verify we can retrieve the updated key
    const retrievedKey = await prisma.apiKey.findUnique({
      where: { id: 'default-api-key' },
    });
    expect(retrievedKey?.key).toBe(newKey);
  });
}); 