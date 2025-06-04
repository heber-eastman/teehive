"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../auth");
const prisma_1 = require("../lib/prisma");
const router = express_1.default.Router();
// Get all API keys
router.get('/', auth_1.isAuthenticated, async (req, res) => {
    try {
        const apiKeys = await prisma_1.prisma.apiKey.findMany();
        res.json(apiKeys);
    }
    catch (err) {
        console.error('Error fetching API keys:', err);
        res.status(500).json({ error: 'Failed to fetch API keys' });
    }
});
// Create new API key
router.post('/', auth_1.isAuthenticated, async (req, res) => {
    try {
        const apiKeyData = {
            key: generateApiKey(),
        };
        const apiKey = await prisma_1.prisma.apiKey.create({
            data: apiKeyData,
        });
        res.status(201).json(apiKey);
    }
    catch (err) {
        console.error('Error creating API key:', err);
        res.status(500).json({ error: 'Failed to create API key' });
    }
});
// Delete API key
router.delete('/:id', auth_1.isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.prisma.apiKey.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (err) {
        console.error('Error deleting API key:', err);
        res.status(500).json({ error: 'Failed to delete API key' });
    }
});
// Helper function to generate API key
function generateApiKey() {
    return `tk_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
}
exports.default = router;
