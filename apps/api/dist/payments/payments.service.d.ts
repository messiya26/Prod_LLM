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
            id: string;
            email: string;
            firstName: string;
            lastName: string;
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
        amount: import(".prisma/client/runtime/library").Decimal;
        currency: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string;
        providerTxId: string | null;
        metadata: string | null;
        userId: string;
        enrollmentId: string | null;
        courseId: string;
    }>;
    confirm(reference: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import(".prisma/client/runtime/library").Decimal;
        currency: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string;
        providerTxId: string | null;
        metadata: string | null;
        userId: string;
        enrollmentId: string | null;
        courseId: string;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        course: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import(".prisma/client/runtime/library").Decimal;
        currency: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string;
        providerTxId: string | null;
        metadata: string | null;
        userId: string;
        enrollmentId: string | null;
        courseId: string;
    })[]>;
    findByUser(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            email: string;
            firstName: string;
            lastName: string;
        };
        course: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: import(".prisma/client/runtime/library").Decimal;
        currency: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string;
        providerTxId: string | null;
        metadata: string | null;
        userId: string;
        enrollmentId: string | null;
        courseId: string;
    })[]>;
    stats(): import(".prisma/client").Prisma.PrismaPromise<unknown>;
    instructorStats(instructorId: string): Promise<{
        totalRevenue: number;
        totalStudents: number;
        payments: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
            course: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            amount: import(".prisma/client/runtime/library").Decimal;
            currency: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            method: import(".prisma/client").$Enums.PaymentMethod;
            reference: string;
            providerTxId: string | null;
            metadata: string | null;
            userId: string;
            enrollmentId: string | null;
            courseId: string;
        })[];
        courses: {
            revenue: number;
            students: number;
            id: string;
            title: string;
        }[];
    }>;
    instructorStudents(instructorId: string): Promise<({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatar: string | null;
        };
        course: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        userId: string;
        courseId: string;
        progress: number;
    })[]>;
}
