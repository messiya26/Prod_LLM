import { PrismaService } from "../prisma/prisma.service";
export declare class SecuritySettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    get(): Promise<{
        id: string;
        updatedAt: Date;
        passwordMinLength: number;
        passwordRequireUpper: boolean;
        passwordRequireLower: boolean;
        passwordRequireNumber: boolean;
        passwordRequireSpecial: boolean;
        passwordExpiryDays: number;
        maxLoginAttempts: number;
        lockoutDurationMin: number;
        sessionTimeoutMin: number;
        maxActiveSessions: number;
        requireEmailVerification: boolean;
        twoFactorEnabled: boolean;
        dataRetentionDays: number;
        auditRetentionDays: number;
    }>;
    update(data: any): Promise<{
        id: string;
        updatedAt: Date;
        passwordMinLength: number;
        passwordRequireUpper: boolean;
        passwordRequireLower: boolean;
        passwordRequireNumber: boolean;
        passwordRequireSpecial: boolean;
        passwordExpiryDays: number;
        maxLoginAttempts: number;
        lockoutDurationMin: number;
        sessionTimeoutMin: number;
        maxActiveSessions: number;
        requireEmailVerification: boolean;
        twoFactorEnabled: boolean;
        dataRetentionDays: number;
        auditRetentionDays: number;
    }>;
    validatePassword(password: string): Promise<{
        valid: boolean;
        errors: string[];
    }>;
}
