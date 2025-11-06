"use strict";
/**
 * Non-interactive script to create admin user
 * Run with: npm run create-admin -- username password
 * Or: tsx src/scripts/createAdmin.ts username password
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const admins_1 = require("../db/queries/admins");
const connection_1 = __importDefault(require("../db/connection"));
dotenv_1.default.config();
async function createAdmin() {
    const username = process.argv[2] || 'admin';
    const password = process.argv[3] || 'admin123';
    try {
        // Test database connection
        await connection_1.default.query('SELECT NOW()');
        console.log('✅ Connected to PostgreSQL');
        // Check if admin exists
        const existingAdmin = await admins_1.adminQueries.findByUsername(username);
        if (existingAdmin) {
            console.log(`⚠️  Admin user "${username}" already exists`);
            console.log('   Skipping creation.');
            await connection_1.default.end();
            process.exit(0);
        }
        // Create admin
        const admin = await admins_1.adminQueries.create(username, password);
        console.log('✅ Admin user created successfully!');
        console.log(`   Username: ${username}`);
        console.log(`   Password: ${password}`);
        console.log('   Please keep your password secure.');
    }
    catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
    finally {
        await connection_1.default.end();
        process.exit(0);
    }
}
createAdmin();
//# sourceMappingURL=createAdmin.js.map