import { SiteContentService } from "./site-content.service";
export declare class SiteContentController {
    private readonly siteContentService;
    constructor(siteContentService: SiteContentService);
    getAll(): Promise<{
        id: string;
        key: string;
        value: string;
        type: string;
        updatedAt: Date;
    }[]>;
    get(key: string): Promise<{
        id: string;
        key: string;
        value: string;
        type: string;
        updatedAt: Date;
    } | null>;
    upsert(key: string, body: {
        value: string;
        type?: string;
    }): Promise<{
        id: string;
        key: string;
        value: string;
        type: string;
        updatedAt: Date;
    }>;
    bulkUpsert(body: {
        items: {
            key: string;
            value: string;
            type?: string;
        }[];
    }): Promise<{
        id: string;
        key: string;
        value: string;
        type: string;
        updatedAt: Date;
    }[]>;
    seed(): Promise<{
        seeded: number;
        total: number;
    }>;
}
