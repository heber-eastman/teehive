import { PrismaClient } from '@prisma/client';

describe('Prisma Client', () => {
  const prisma = new PrismaClient();

  beforeAll(async () => {
    // Clean up any existing data
    await prisma.teeTime.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should connect to the database and find no tee times', async () => {
    const teeTimes = await prisma.teeTime.findMany();
    expect(teeTimes).toEqual([]);
  });
}); 