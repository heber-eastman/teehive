import { PrismaClient } from '@prisma/client';

// Create a single PrismaClient instance to be used throughout the application
export const prisma = new PrismaClient(); 