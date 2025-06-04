"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// Load environment variables first
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const prisma_1 = require("./lib/prisma");
const envPath = path_1.default.resolve(__dirname, '..', '.env');
console.log('Loading .env from:', envPath);
console.log('File exists:', fs_1.default.existsSync(envPath));
const result = (0, dotenv_1.config)({ path: envPath });
if (result.error) {
    console.error('Error loading .env file:', result.error);
    process.exit(1);
}
// Verify required environment variables
const requiredEnvVars = [
    'DATABASE_URL',
    'SESSION_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'PORT'
];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (process.env.NODE_ENV !== 'test' && missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    process.exit(1);
}
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const auth_1 = require("./auth");
const admin_1 = __importDefault(require("./admin"));
const public_1 = __importDefault(require("./routes/public"));
const teeTimes_1 = __importDefault(require("./routes/teeTimes"));
const multer_1 = __importDefault(require("multer"));
const csvParser_1 = require("./utils/csvParser");
const app = (0, express_1.default)();
exports.app = app;
const port = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)({
    origin: ['http://192.168.1.254:8082', 'exp://192.168.1.254:8082'],
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, express_session_1.default)(auth_1.sessionConfig));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Serve static files from public directory
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
// Configure Passport
(0, auth_1.configurePassport)();
// Configure multer for memory storage
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Define column definitions for testing
const testColumns = [
    {
        name: 'name',
        validation: {
            type: 'string',
            required: true,
            pattern: /^[A-Za-z\s]+$/,
        },
    },
    {
        name: 'age',
        validation: {
            type: 'number',
            required: true,
            min: 0,
            max: 120,
        },
    },
    {
        name: 'email',
        validation: {
            type: 'string',
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
    },
    {
        name: 'isActive',
        validation: {
            type: 'boolean',
            required: false,
        },
    },
];
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// Auth routes
app.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/');
});
// Protected route example
app.get('/api/me', auth_1.isAuthenticated, (req, res) => {
    const user = req.user;
    res.json({ email: user.email });
});
// Mount admin routes
app.use('/v1/admin', admin_1.default);
// Mount public routes
app.use('/v1/public', public_1.default);
// Mount tee times routes
app.use('/v1/tee-times', teeTimes_1.default);
// Add test endpoint for CSV upload
app.post('/api/test/csv-upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const result = await (0, csvParser_1.parseCSV)(req.file.buffer, testColumns);
        res.json(result);
    }
    catch (error) {
        console.error('CSV parsing error:', error);
        res.status(500).json({ error: 'Failed to parse CSV file' });
    }
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});
// Connect to database and start server
async function startServer() {
    try {
        // Log database URL (masked)
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            throw new Error('DATABASE_URL is not set in environment variables');
        }
        console.log('🔌 Database URL:', dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//****:****@'));
        await prisma_1.prisma.$connect();
        console.log('✅ Successfully connected to database');
        app.listen(Number(port), () => {
            console.log(`🚀 Server running at http://0.0.0.0:${port}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to connect to database:', error);
        process.exit(1);
    }
}
// Start the server
if (process.env.NODE_ENV !== 'test') {
    startServer();
}
