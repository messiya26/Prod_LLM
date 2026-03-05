import { PrismaService } from "../prisma/prisma.service";
export declare class SessionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        userId: string;
        token: string;
        ip?: string;
        userAgent?: string;
        expiresAt: Date;
    }): Promise<{
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
    }>;
    findByUser(userId: string): Promise<{
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
    revoke(sessionId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    revokeAll(userId: string, exceptSessionId?: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    touch(token: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    cleanup(): Promise<import(".prisma/client").Prisma.BatchPayload>;
    private parseDevice;
}
