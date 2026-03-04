import { PrismaService } from "../prisma/prisma.service";
export declare class SiteContentService {
    private prisma;
    constructor(prisma: PrismaService);
    get(key: string): Promise<{
        id: string;
        updatedAt: Date;
        type: string;
        key: string;
        value: string;
    } | null>;
    getAll(): Promise<{
        id: string;
        updatedAt: Date;
        type: string;
        key: string;
        value: string;
    }[]>;
    upsert(key: string, value: string, type?: string): Promise<{
        id: string;
        updatedAt: Date;
        type: string;
        key: string;
        value: string;
    }>;
    bulkUpsert(items: {
        key: string;
        value: string;
        type?: string;
    }[]): Promise<{
        id: string;
        updatedAt: Date;
        type: string;
        key: string;
        value: string;
    }[]>;
}
