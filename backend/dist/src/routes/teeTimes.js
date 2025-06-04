"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const apiKeyAuth_1 = require("../middleware/apiKeyAuth");
const router = (0, express_1.Router)();
/**
 * @route GET /v1/tee-times
 * @desc Get all tee times
 * @access Protected (API Key)
 */
router.get('/', apiKeyAuth_1.apiKeyAuth, async (req, res) => {
    try {
        const teeTimes = await prisma_1.prisma.teeTime.findMany({
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
