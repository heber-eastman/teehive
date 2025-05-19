import { PrismaClient } from '@prisma/client';

describe('Prisma Client', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should connect to the database and find no tee times', async () => {
    const teeTimes = await prisma.teeTime.findMany();
    expect(teeTimes).toEqual([]);
  });
}); 