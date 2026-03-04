import { PrismaService } from "../prisma/prisma.service";
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: {
        courseId: string;
        amount: number;
        method: string;
        metadata?: string;
    }): Promise<{
        user: {
            firstName: string;
            lastName: string;
            email: string;
            id: string;
        };
        course: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            description: string;
            thumbnail: string | null;
            level: import(".prisma/client").$Enums.Level;
            price: import(".prisma/client/runtime/library").Decimal;
            published: boolean;
            categoryId: string;
            instructorId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        courseId: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        amount: import(".prisma/client/runtime/library").Decimal;
        currency: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string;
        providerTxId: string | null;
        metadata: string | null;
        enrollmentId: string | null;
    }>;
    confirm(reference: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        courseId: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        amount: import(".prisma/client/runtime/library").Decimal;
        currency: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string;
        providerTxId: string | null;
        metadata: string | null;
        enrollmentId: string | null;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            firstName: string;
            lastName: string;
            email: string;
            id: string;
        };
        course: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        courseId: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        amount: import(".prisma/client/runtime/library").Decimal;
        currency: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string;
        providerTxId: string | null;
        metadata: string | null;
        enrollmentId: string | null;
    })[]>;
    findByUser(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
        course: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        courseId: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        amount: import(".prisma/client/runtime/library").Decimal;
        currency: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string;
        providerTxId: string | null;
        metadata: string | null;
        enrollmentId: string | null;
    })[]>;
    stats(): import(".prisma/client").Prisma.PrismaPromise<unknown>;
}
