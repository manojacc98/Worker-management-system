"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const SalarySchema = new mongoose_1.Schema({
    workerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Worker',
        required: [true, 'Worker ID is required'],
    },
    cycleType: {
        type: String,
        enum: ['weekly', 'monthly'],
        required: [true, 'Cycle type is required'],
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
    },
    totalHours: {
        type: Number,
        required: [true, 'Total hours is required'],
        min: [0, 'Total hours must be positive'],
    },
    hourlyRate: {
        type: Number,
        required: [true, 'Hourly rate is required'],
        min: [0, 'Hourly rate must be positive'],
    },
    grossSalary: {
        type: Number,
        required: [true, 'Gross salary is required'],
        min: [0, 'Gross salary must be positive'],
    },
    advances: {
        type: Number,
        default: 0,
        min: [0, 'Advances must be positive'],
    },
    netSalary: {
        type: Number,
        required: [true, 'Net salary is required'],
    },
    status: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending',
    },
    paidAt: {
        type: Date,
    },
    notes: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
// Index for efficient queries
SalarySchema.index({ workerId: 1, startDate: -1 });
SalarySchema.index({ status: 1 });
exports.default = mongoose_1.default.model('Salary', SalarySchema);
//# sourceMappingURL=Salary.js.map