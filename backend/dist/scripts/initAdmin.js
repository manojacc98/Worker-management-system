"use strict";
/**
 * Script to initialize admin user
 * Run with: npm run init-admin
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const admins_1 = require("../db/queries/admins");
const connection_1 = __importDefault(require("../db/connection"));
const readline_1 = __importDefault(require("readline"));
dotenv_1.default.config();
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const question = (query) => {
    return new Promise((resolve) => rl.question(query, resolve));
};
async function initAdmin() {
    try {
        // Test database connection
        await connection_1.default.query('SELECT NOW()');
        console.log('✅ Connected to PostgreSQL');
        // Check if admin exists
        const existingAdmin = await admins_1.adminQueries.findByUsername('admin');
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            const overwrite = await question('Do you want to create a new admin? (y/n): ');
            if (overwrite.toLowerCase() !== 'y') {
                console.log('Aborted.');
                process.exit(0);
            }
        }
        // Get admin credentials
        const username = await question('Enter admin username: ');
        const password = await question('Enter admin password: ');
        if (!username || !password) {
            console.log('❌ Username and password are required');
            process.exit(1);
        }
        if (password.length < 6) {
            console.log('❌ Password must be at least 6 characters');
            process.exit(1);
        }
        // Create admin
        const admin = await admins_1.adminQueries.create(username, password);
        console.log('✅ Admin user created successfully!');
        console.log(`   Username: ${username}`);
        console.log('   Please keep your password secure.');
    }
    catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
    finally {
        rl.close();
        await connection_1.default.end();
        process.exit(0);
    }
}
initAdmin();
//# sourceMappingURL=initAdmin.js.map