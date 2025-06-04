"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
// Create a single PrismaClient instance to be used throughout the application
exports.prisma = new client_1.PrismaClient();
