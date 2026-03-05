import { PrismaService } from "../prisma/prisma.service";
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(params: {
        userId?: string;
        action: string;
        targetId?: string;
        targetType?: string;
        metadata?: any;
        ip?: string;
        userAgent?: string;
        severity?: string;
    }): Promise<{
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
    } | undefined>;
    findAll(query: {
        page?: number;
        limit?: number;
        userId?: string;
        action?: string;
        from?: string;
        to?: string;
        severity?: string;
    }): Promise<{
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
    getStats(): Promise<{
        totalLogs: number;
        todayLogs: number;
        failedLogins: number;
        recentActions: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.AuditLogGroupByOutputType, "action"[]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
}
