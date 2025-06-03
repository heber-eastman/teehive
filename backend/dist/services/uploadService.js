"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processUpload = processUpload;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function processUpload(uploadedBy, parseResult, fileName) {
    try {
        return await prisma.$transaction(async (tx) => {
            // 1. Delete all existing tee times
            await tx.teeTime.deleteMany();
            // 2. Bulk create new tee times from valid rows
            if (parseResult.validRows.length > 0) {
                await tx.teeTime.createMany({
                    data: parseResult.validRows.map((row) => ({
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
    }
    catch (error) {
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
