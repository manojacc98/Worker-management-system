export declare const generateToken: (userId: string, role?: string) => string;
export declare const verifyToken: (token: string) => {
    userId: string;
    role: string;
} | null;
//# sourceMappingURL=jwt.d.ts.map