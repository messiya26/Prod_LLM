import { AuditService } from "./audit.service";
import { SecuritySettingsService } from "./security-settings.service";
import { SessionsService } from "./sessions.service";
import { GdprService } from "./gdpr.service";
export declare class SecurityController {
    private audit;
    private settings;
    private sessions;
    private gdpr;
    constructor(audit: AuditService, settings: SecuritySettingsService, sessions: SessionsService, gdpr: GdprService);
    getAuditLogs(query: any): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.Role;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            userId: string | null;
            metadata: import(".prisma/client/runtime/library").JsonValue | null;
            action: import(".prisma/client").$Enums.AuditAction;
            targetId: string | null;
            targetType: string | null;
            ip: string | null;
            userAgent: string | null;
            severity: string;
        })[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    getAuditStats(): Promise<{
        totalLogs: number;
        todayLogs: number;
        failedLogins: number;
        recentActions: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.AuditLogGroupByOutputType, "action"[]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
    getSettings(): Promise<{
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
    updateSettings(body: any, req: any): Promise<{
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
    getMySessions(req: any): Promise<{
        id: string;
        createdAt: Date;
        token: string;
        expiresAt: Date;
        userId: string;
        location: string | null;
        ip: string | null;
        userAgent: string | null;
        isActive: boolean;
        device: string | null;
        lastActive: Date;
    }[]>;
    getUserSessions(userId: string): Promise<{
        id: string;
        createdAt: Date;
        token: string;
        expiresAt: Date;
        userId: string;
        location: string | null;
        ip: string | null;
        userAgent: string | null;
        isActive: boolean;
        device: string | null;
        lastActive: Date;
    }[]>;
    revokeSession(id: string, req: any): Promise<{
        message: string;
    }>;
    revokeAllSessions(req: any): Promise<{
        message: string;
    }>;
    exportMyData(req: any): Promise<any>;
    requestExport(req: any): Promise<{
        data: import(".prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        type: string;
        userId: string;
        status: string;
        processedBy: string | null;
        processedAt: Date | null;
    }>;
    requestDelete(req: any): Promise<{
        data: import(".prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        type: string;
        userId: string;
        status: string;
        processedBy: string | null;
        processedAt: Date | null;
    }>;
    listGdprRequests(query: any): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            data: import(".prisma/client/runtime/library").JsonValue | null;
            id: string;
            createdAt: Date;
            type: string;
            userId: string;
            status: string;
            processedBy: string | null;
            processedAt: Date | null;
        })[];
        total: number;
        page: number;
        pages: number;
    }>;
    processGdprRequest(id: string, body: {
        status: "APPROVED" | "REJECTED";
    }, req: any): Promise<{
        data: import(".prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        type: string;
        userId: string;
        status: string;
        processedBy: string | null;
        processedAt: Date | null;
    }>;
}
