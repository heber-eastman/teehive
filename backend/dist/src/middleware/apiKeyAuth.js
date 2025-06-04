"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyAuth = void 0;
const prisma_1 = require("../lib/prisma");
const apiKeyAuth = async (req, res, next) => {
    try {
        // Get the API key from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'API key is required' });
        }
        // Check if the header is in the correct format (Bearer <key>)
        const [bearer, apiKey] = authHeader.split(' ');
        if (bearer !== 'Bearer' || !apiKey) {
            return res.status(401).json({ error: 'Invalid authorization format. Use: Bearer <api-key>' });
        }
        // Check if the API key exists in the database
        const validKey = await prisma_1.prisma.apiKey.findFirst({
            where: { key: apiKey }
        });
        if (!validKey) {
            return res.status(401).json({ error: 'Invalid API key' });
        }
        // Add the API key to the request object for potential future use
        req.apiKey = apiKey;
        next();
    }
    catch (error) {
        console.error('API key authentication error:', error);
        res.status(500).json({ error: 'Internal server error during authentication' });
    }
};
exports.apiKeyAuth = apiKeyAuth;
