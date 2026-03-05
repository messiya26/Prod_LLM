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
        userId: string;
        token: string;
        expiresAt: Date;
        location: string | null;
        ip: string | null;
        userAgent: string | null;
        device: string | null;
        isActive: boolean;
        lastActive: Date;
    }>;
    findByUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        token: string;
        expiresAt: Date;
        location: string | null;
        ip: string | null;
        userAgent: string | null;
        device: string | null;
        isActive: boolean;
        lastActive: Date;
    }[]>;
    revoke(sessionId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    revokeAll(userId: string, exceptSessionId?: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    touch(token: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    cleanup(): Promise<import(".prisma/client").Prisma.BatchPayload>;
    private parseDevice;
}
