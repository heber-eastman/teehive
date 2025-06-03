"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
/**
 * @route GET /v1/public/api-key
 * @desc Get the public API key
 * @access Public
 */
router.get('/api-key', (req, res) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }
    res.json({ apiKey });
});
exports.default = router;
