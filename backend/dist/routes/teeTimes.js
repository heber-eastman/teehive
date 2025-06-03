"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const apiKeyAuth_1 = require("../middleware/apiKeyAuth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
/**
 * @route GET /v1/tee-times
 * @desc Get all tee times
 * @access Protected (API Key)
 */
router.get('/', apiKeyAuth_1.apiKeyAuth, async (req, res) => {
    try {
        const teeTimes = await prisma.teeTime.findMany({
            orderBy: {
                dateTime: 'asc'
            }
        });
        res.json(teeTimes);
    }
    catch (error) {
        console.error('Error fetching tee times:', error);
        res.status(500).json({ error: 'Failed to fetch tee times' });
    }
});
exports.default = router;
