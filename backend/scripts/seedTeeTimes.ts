import { prisma } from '../src/lib/prisma';

async function seedTeeTimes() {
  try {
    // Clear existing tee times
    await prisma.teeTime.deleteMany();

    // Add new tee times
    const teeTimes = [
      {
        courseName: 'Pine Valley Golf Club',
        dateTime: new Date('2024-03-25T10:00:00Z'),
        spotsAvailable: 4,
        priceAmount: 150.00,
        currency: 'USD',
        holes: 18,
        bookingUrl: 'https://example.com/book1'
      },
      {
        courseName: 'Augusta National',
        dateTime: new Date('2024-03-26T14:30:00Z'),
        spotsAvailable: 2,
        priceAmount: 200.00,
        currency: 'USD',
        holes: 18,
        bookingUrl: 'https://example.com/book2'
      },
      {
        courseName: 'St Andrews Links',
        dateTime: new Date('2024-03-27T09:15:00Z'),
        spotsAvailable: 1,
        priceAmount: 175.00,
        currency: 'GBP',
        holes: 9,
        bookingUrl: 'https://example.com/book3'
      }
    ];

    for (const teeTime of teeTimes) {
      await prisma.teeTime.create({
        data: teeTime
      });
    }

    console.log('✅ Successfully seeded tee times');
  } catch (error) {
    console.error('Error seeding tee times:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTeeTimes(); 