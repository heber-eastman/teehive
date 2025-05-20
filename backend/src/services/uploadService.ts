import { PrismaClient, Prisma } from '@prisma/client';
import { ParseResult } from '../utils/csvParser';

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

export interface UploadResult {
  success: boolean;
  totalRows: number;
  validRows: number;
  skippedRows: number;
  error?: string;
}

export async function processUpload(uploadedBy: string, parseResult: ParseResult<TeeTimeRow>, fileName: string): Promise<UploadResult> {
  try {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Delete all existing tee times
      await tx.teeTime.deleteMany();

      // 2. Bulk create new tee times from valid rows
      if (parseResult.validRows.length > 0) {
        await tx.teeTime.createMany({
          data: parseResult.validRows.map((row: TeeTimeRow) => ({
            courseName: row.course_name,
            dateTime: new Date(row.date_time),
            spotsAvailable: parseInt(row.spots_available),
            priceAmount: parseFloat(row.price_amount),
            currency: row.currency,
            holes: parseInt(row.holes),
            bookingUrl: row.booking_url
          }))
        });
      }

      // 3. Create upload log
      const uploadLog = await tx.uploadLog.create({
        data: {
          fileName,
          totalRecords: parseResult.totalRows,
          validRecords: parseResult.validRows.length,
          skippedRecords: parseResult.invalidRows.length,
          errorMessage: parseResult.invalidRows.length > 0 ? 'Some rows were invalid' : null,
          uploadedBy,
        }
      });

      return {
        success: true,
        totalRows: parseResult.totalRows,
        validRows: parseResult.validRows.length,
        skippedRows: parseResult.invalidRows.length
      };
    });
  } catch (error) {
    console.error('Upload processing error:', error);
    return {
      success: false,
      totalRows: parseResult.totalRows,
      validRows: parseResult.validRows.length,
      skippedRows: parseResult.invalidRows.length,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 