import { PrismaService } from "../prisma/prisma.service";
export declare class HealthController {
    private prisma;
    constructor(prisma: PrismaService);
    check(): {
        status: string;
        timestamp: string;
        service: string;
    };
    seed(secret: string): Promise<{
        message: string;
    }>;
}
