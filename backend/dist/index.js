"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const connection_1 = __importDefault(require("./db/connection"));
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const workers_1 = __importDefault(require("./routes/workers"));
const updates_1 = __importDefault(require("./routes/updates"));
const salary_1 = __importDefault(require("./routes/salary"));
const admin_1 = __importDefault(require("./routes/admin"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Create uploads directory if it doesn't exist
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Serve uploaded files statically
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Health check
app.get('/api/health', async (req, res) => {
    try {
        await connection_1.default.query('SELECT 1');
        res.json({ status: 'ok', message: 'Worker Management API is running', database: 'connected' });
    }
    catch (error) {
        res.json({ status: 'ok', message: 'Worker Management API is running', database: 'disconnected' });
    }
});
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/workers', workers_1.default);
app.use('/api/updates', updates_1.default);
app.use('/api/salary', salary_1.default);
app.use('/api/admin', admin_1.default);
// Test PostgreSQL connection and start server
connection_1.default.query('SELECT NOW()')
    .then(() => {
    console.log('✅ Connected to PostgreSQL');
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('❌ PostgreSQL connection error:', error);
    console.error('Please ensure PostgreSQL is running and connection details are correct in .env');
    process.exit(1);
});
exports.default = app;
//# sourceMappingURL=index.js.map