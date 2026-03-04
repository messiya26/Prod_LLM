import { SiteContentService } from "./site-content.service";
export declare class SiteContentController {
    private readonly siteContentService;
    constructor(siteContentService: SiteContentService);
    getAll(): Promise<{
        id: string;
        updatedAt: Date;
        type: string;
        key: string;
        value: string;
    }[]>;
    get(key: string): Promise<{
        id: string;
        updatedAt: Date;
        type: string;
        key: string;
        value: string;
    } | null>;
    upsert(key: string, body: {
        value: string;
        type?: string;
    }): Promise<{
        id: string;
        updatedAt: Date;
        type: string;
        key: string;
        value: string;
    }>;
    bulkUpsert(body: {
        items: {
            key: string;
            value: string;
            type?: string;
        }[];
    }): Promise<{
        id: string;
        updatedAt: Date;
        type: string;
        key: string;
        value: string;
    }[]>;
}
