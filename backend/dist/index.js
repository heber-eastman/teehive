"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load environment variables first
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const envPath = path_1.default.resolve(__dirname, '..', '.env');
console.log('Loading .env from:', envPath);
console.log('File exists:', fs_1.default.existsSync(envPath));
if (fs_1.default.existsSync(envPath)) {
    const result = (0, dotenv_1.config)({ path: envPath });
    console.log('Dotenv config result:', result);
}
// Force reload environment variables
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
process.env.SESSION_SECRET = process.env.SESSION_SECRET;
process.env.DATABASE_URL = process.env.DATABASE_URL;
process.env.PORT = process.env.PORT;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const auth_1 = require("./auth");
const admin_1 = __importDefault(require("./admin"));
const public_1 = __importDefault(require("./routes/public"));
const teeTimes_1 = __importDefault(require("./routes/teeTimes"));
const multer_1 = __importDefault(require("multer"));
const csvParser_1 = require("./utils/csvParser");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const port = process.env.PORT || 3000;
// Middleware
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
app.use('/', admin_1.default);
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
// Connect to database and start server
async function startServer() {
    try {
        // Log database URL (masked)
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            throw new Error('DATABASE_URL is not set in environment variables');
        }
        console.log('🔌 Database URL:', dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//****:****@'));
        await prisma.$connect();
        console.log('✅ Successfully connected to database');
        app.listen(port, () => {
            console.log(`🚀 Server running at http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to connect to database:', error);
        process.exit(1);
    }
}
startServer();
