"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const crypto_1 = __importDefault(require("crypto"));
const router = (0, express_1.Router)();
/**
 * @route GET /v1/public/api-key
 * @desc Get the public API key
 * @access Public
 */
router.get('/api-key', async (req, res) => {
    try {
        const apiKey = await prisma_1.prisma.apiKey.findFirst();
        if (!apiKey) {
            return res.status(500).json({ error: 'No API key found in database' });
        }
        // Hash the API key before returning it
        const hashedKey = crypto_1.default.createHash('sha256').update(apiKey.key).digest('hex');
        res.json({ apiKey: hashedKey });
    }
    catch (error) {
        console.error('Error fetching API key:', error);
        res.status(500).json({ error: 'Failed to fetch API key' });
    }
});
exports.default = router;
