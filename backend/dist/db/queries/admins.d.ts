export declare const adminQueries: {
    findByUsername: (username: string) => Promise<any>;
    findById: (id: string) => Promise<any>;
    create: (username: string, password: string) => Promise<any>;
    updatePassword: (id: string, newPassword: string) => Promise<any>;
    comparePassword: (plainPassword: string, hashedPassword: string) => Promise<boolean>;
};
//# sourceMappingURL=admins.d.ts.map