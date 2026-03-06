import { PrismaService } from "../prisma/prisma.service";
export declare class SiteContentService {
    private prisma;
    constructor(prisma: PrismaService);
    get(key: string): Promise<{
        id: string;
        key: string;
        value: string;
        type: string;
        updatedAt: Date;
    } | null>;
    getAll(): Promise<{
        id: string;
        key: string;
        value: string;
        type: string;
        updatedAt: Date;
    }[]>;
    upsert(key: string, value: string, type?: string): Promise<{
        id: string;
        key: string;
        value: string;
        type: string;
        updatedAt: Date;
    }>;
    bulkUpsert(items: {
        key: string;
        value: string;
        type?: string;
    }[]): Promise<{
        id: string;
        key: string;
        value: string;
        type: string;
        updatedAt: Date;
    }[]>;
}
