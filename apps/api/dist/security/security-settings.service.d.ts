import { PrismaService } from "../prisma/prisma.service";
export declare class SecuritySettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    get(): Promise<{
        id: string;
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
        updatedAt: Date;
    } | null>;
    update(data: any): Promise<{
        id: string;
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
        updatedAt: Date;
    }>;
    validatePassword(password: string): Promise<{
        valid: boolean;
        errors: string[];
    }>;
}
