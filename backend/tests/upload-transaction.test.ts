import { PrismaClient } from '@prisma/client';
import { processUpload } from '../src/services/uploadService';
import { parseCSV } from '../src/utils/csvParser';

const prisma = new PrismaClient();

interface TeeTimeRow {
  course_name: string;
  date_time: string;
  spots_available: string;
  price_amount: string;
  currency: string;
  holes: string;
  booking_url: string;
}

describe('Upload Service Integration Tests', () => {
  beforeEach(async () => {
    // Clean up the database before each test
    await prisma.uploadLog.deleteMany();
    await prisma.teeTime.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should process a valid CSV upload correctly', async () => {
    // Prepare test data
    const csvData = Buffer.from(
      'course_name,date_time,spots_available,price_amount,currency,holes,booking_url\n' +
      'Test Course,2024-03-20T10:00:00Z,4,50.00,USD,18,https://example.com/book\n' +
      'Another Course,2024-03-21T14:30:00Z,2,75.00,USD,9,https://example.com/book2'
    );

    const columns = [
      { name: 'course_name', validation: { type: 'string' as const, required: true } },
      { name: 'date_time', validation: { type: 'date' as const, required: true } },
      { name: 'spots_available', validation: { type: 'number' as const, required: true } },
      { name: 'price_amount', validation: { type: 'number' as const, required: true } },
      { name: 'currency', validation: { type: 'string' as const, required: true } },
      { name: 'holes', validation: { type: 'number' as const, required: true } },
      { name: 'booking_url', validation: { type: 'string' as const, required: true } },
    ];

    // Parse CSV
    const parseResult = await parseCSV<TeeTimeRow>(csvData, columns);

    // Process upload
    const result = await processUpload('test@example.com', parseResult, 'test.csv');

    // Verify upload result
    expect(result.success).toBe(true);
    expect(result.totalRows).toBe(2);
    expect(result.validRows).toBe(2);
    expect(result.skippedRows).toBe(0);

    // Verify database state
    const teeTimes = await prisma.teeTime.findMany();
    expect(teeTimes).toHaveLength(2);
    expect(teeTimes[0].courseName).toBe('Test Course');
    expect(teeTimes[1].courseName).toBe('Another Course');

    const uploadLogs = await prisma.uploadLog.findMany();
    expect(uploadLogs).toHaveLength(1);
    expect(uploadLogs[0].uploadedBy).toBe('test@example.com');
    expect(uploadLogs[0].fileName).toBe('test.csv');
    expect(uploadLogs[0].totalRecords).toBe(2);
    expect(uploadLogs[0].validRecords).toBe(2);
    expect(uploadLogs[0].skippedRecords).toBe(0);
  });

  it('should handle invalid rows and create upload log', async () => {
    // Prepare test data with invalid rows
    const csvData = Buffer.from(
      'course_name,date_time,spots_available,price_amount,currency,holes,booking_url\n' +
      'Test Course,2024-03-20T10:00:00Z,4,50.00,USD,18,https://example.com/book\n' +
      'Invalid Course,invalid-date,invalid-spots,invalid-price,USD,invalid-holes,https://example.com/book2\n' +
      'Another Course,2024-03-21T14:30:00Z,2,75.00,USD,9,https://example.com/book3'
    );

    const columns = [
      { name: 'course_name', validation: { type: 'string' as const, required: true } },
      { name: 'date_time', validation: { type: 'date' as const, required: true } },
      { name: 'spots_available', validation: { type: 'number' as const, required: true } },
      { name: 'price_amount', validation: { type: 'number' as const, required: true } },
      { name: 'currency', validation: { type: 'string' as const, required: true } },
      { name: 'holes', validation: { type: 'number' as const, required: true } },
      { name: 'booking_url', validation: { type: 'string' as const, required: true } },
    ];

    // Parse CSV
    const parseResult = await parseCSV<TeeTimeRow>(csvData, columns);

    // Process upload
    const result = await processUpload('test@example.com', parseResult, 'test-invalid.csv');

    // Verify upload result
    expect(result.success).toBe(true);
    expect(result.totalRows).toBe(3);
    expect(result.validRows).toBe(2);
    expect(result.skippedRows).toBe(1);

    // Verify database state
    const teeTimes = await prisma.teeTime.findMany();
    expect(teeTimes).toHaveLength(2);
    expect(teeTimes.map(t => t.courseName)).toEqual(['Test Course', 'Another Course']);

    const uploadLogs = await prisma.uploadLog.findMany();
    expect(uploadLogs).toHaveLength(1);
    expect(uploadLogs[0].uploadedBy).toBe('test@example.com');
    expect(uploadLogs[0].fileName).toBe('test-invalid.csv');
    expect(uploadLogs[0].totalRecords).toBe(3);
    expect(uploadLogs[0].validRecords).toBe(2);
    expect(uploadLogs[0].skippedRecords).toBe(1);
  });

  it('should handle empty CSV and create upload log', async () => {
    // Prepare empty CSV
    const csvData = Buffer.from('course_name,date_time,spots_available,price_amount,currency,holes,booking_url\n');

    const columns = [
      { name: 'course_name', validation: { type: 'string' as const, required: true } },
      { name: 'date_time', validation: { type: 'date' as const, required: true } },
      { name: 'spots_available', validation: { type: 'number' as const, required: true } },
      { name: 'price_amount', validation: { type: 'number' as const, required: true } },
      { name: 'currency', validation: { type: 'string' as const, required: true } },
      { name: 'holes', validation: { type: 'number' as const, required: true } },
      { name: 'booking_url', validation: { type: 'string' as const, required: true } },
    ];

    // Parse CSV
    const parseResult = await parseCSV<TeeTimeRow>(csvData, columns);

    // Process upload
    const result = await processUpload('test@example.com', parseResult, 'test-empty.csv');

    // Verify upload result
    expect(result.success).toBe(true);
    expect(result.totalRows).toBe(0);
    expect(result.validRows).toBe(0);
    expect(result.skippedRows).toBe(0);

    // Verify database state
    const teeTimes = await prisma.teeTime.findMany();
    expect(teeTimes).toHaveLength(0);

    const uploadLogs = await prisma.uploadLog.findMany();
    expect(uploadLogs).toHaveLength(1);
    expect(uploadLogs[0].uploadedBy).toBe('test@example.com');
    expect(uploadLogs[0].fileName).toBe('test-empty.csv');
    expect(uploadLogs[0].totalRecords).toBe(0);
    expect(uploadLogs[0].validRecords).toBe(0);
    expect(uploadLogs[0].skippedRecords).toBe(0);
  });
}); 