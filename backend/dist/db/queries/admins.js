"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminQueries = void 0;
const connection_1 = __importDefault(require("../connection"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.adminQueries = {
    findByUsername: async (username) => {
        const result = await connection_1.default.query('SELECT * FROM admins WHERE username = $1', [username.toLowerCase()]);
        return result.rows[0];
    },
    findById: async (id) => {
        const result = await connection_1.default.query('SELECT id, username, created_at, updated_at FROM admins WHERE id = $1', [id]);
        return result.rows[0];
    },
    create: async (username, password) => {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const result = await connection_1.default.query('INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING id, username, created_at, updated_at', [username.toLowerCase(), hashedPassword]);
        return result.rows[0];
    },
    updatePassword: async (id, newPassword) => {
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        const result = await connection_1.default.query('UPDATE admins SET password = $1 WHERE id = $2 RETURNING id, username', [hashedPassword, id]);
        return result.rows[0];
    },
    comparePassword: async (plainPassword, hashedPassword) => {
        return bcryptjs_1.default.compare(plainPassword, hashedPassword);
    },
};
//# sourceMappingURL=admins.js.map