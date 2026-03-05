import { SubscriptionsService } from "./subscriptions.service";
import { CreateSubscriptionDto } from "./subscriptions.dto";
export declare class SubscriptionsController {
    private service;
    constructor(service: SubscriptionsService);
    getCurrent(req: any): Promise<{
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
    subscribe(req: any, dto: CreateSubscriptionDto): Promise<{
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
    cancel(req: any): Promise<{
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
