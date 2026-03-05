import { PrismaService } from "../prisma/prisma.service";
export declare class SubscriptionsService {
    private prisma;
    constructor(prisma: PrismaService);
    subscribe(userId: string, plan: string, interval?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        endDate: Date | null;
        startDate: Date;
        currency: string;
        amount: number;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        interval: string;
        cancelledAt: Date | null;
    }>;
    cancel(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        endDate: Date | null;
        startDate: Date;
        currency: string;
        amount: number;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        interval: string;
        cancelledAt: Date | null;
    } | {
        message: string;
    }>;
    getCurrent(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        endDate: Date | null;
        startDate: Date;
        currency: string;
        amount: number;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        interval: string;
        cancelledAt: Date | null;
    } | {
        plan: "FREE";
        status: "ACTIVE";
        amount: number;
        interval: string;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        endDate: Date | null;
        startDate: Date;
        currency: string;
        amount: number;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        interval: string;
        cancelledAt: Date | null;
    })[]>;
    stats(): import(".prisma/client").Prisma.GetSubscriptionGroupByPayload<{
        by: "plan"[];
        where: {
            status: "ACTIVE";
        };
        _count: true;
    }>;
}
