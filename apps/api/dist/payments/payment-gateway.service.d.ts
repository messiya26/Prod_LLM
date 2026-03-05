import { PrismaService } from "../prisma/prisma.service";
export declare class PaymentGatewayService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        code: string;
        name: string;
        icon: string | null;
        enabled: boolean;
        sandboxMode: boolean;
        config: import(".prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findEnabled(): Promise<{
        id: string;
        code: string;
        name: string;
        icon: string | null;
        enabled: boolean;
        sandboxMode: boolean;
        config: import(".prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    update(id: string, data: {
        enabled?: boolean;
        sandboxMode?: boolean;
        config?: any;
    }): Promise<{
        id: string;
        code: string;
        name: string;
        icon: string | null;
        enabled: boolean;
        sandboxMode: boolean;
        config: import(".prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getPublicGateways(): Promise<{
        code: string;
        name: string;
        icon: string | null;
        enabled: boolean;
    }[]>;
    getConfigFields(code: string): Promise<{
        field: string;
        label: string;
        type: string;
        required: boolean;
    }[]>;
}
