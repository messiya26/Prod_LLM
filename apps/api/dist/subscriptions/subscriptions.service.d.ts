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
        amount: number;
        currency: string;
        endDate: Date | null;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        interval: string;
        startDate: Date;
        cancelledAt: Date | null;
    }>;
    cancel(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        amount: number;
        currency: string;
        endDate: Date | null;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        interval: string;
        startDate: Date;
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
        amount: number;
        currency: string;
        endDate: Date | null;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        interval: string;
        startDate: Date;
        cancelledAt: Date | null;
    } | {
        plan: "FREE";
        status: "ACTIVE";
        amount: number;
        interval: string;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            firstName: string;
            lastName: string;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        amount: number;
        currency: string;
        endDate: Date | null;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        interval: string;
        startDate: Date;
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
