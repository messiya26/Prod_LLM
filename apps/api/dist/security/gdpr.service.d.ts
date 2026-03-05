import { PrismaService } from "../prisma/prisma.service";
export declare class GdprService {
    private prisma;
    constructor(prisma: PrismaService);
    exportUserData(userId: string): Promise<any>;
    createDeleteRequest(userId: string): Promise<{
        data: import(".prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        type: string;
        userId: string;
        status: string;
        processedBy: string | null;
        processedAt: Date | null;
    }>;
    createExportRequest(userId: string): Promise<{
        data: import(".prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        type: string;
        userId: string;
        status: string;
        processedBy: string | null;
        processedAt: Date | null;
    }>;
    listRequests(query: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<{
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
    processRequest(requestId: string, processedBy: string, status: "APPROVED" | "REJECTED"): Promise<{
        data: import(".prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        type: string;
        userId: string;
        status: string;
        processedBy: string | null;
        processedAt: Date | null;
    }>;
    private anonymizeUser;
}
