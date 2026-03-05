import { PaymentsService } from "./payments.service";
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    create(req: any, dto: {
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
        amount: import(".prisma/client/runtime/library").Decimal;
        currency: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string;
        providerTxId: string | null;
        metadata: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        enrollmentId: string | null;
        courseId: string;
    }>;
    confirm(reference: string): Promise<{
        id: string;
        amount: import(".prisma/client/runtime/library").Decimal;
        currency: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string;
        providerTxId: string | null;
        metadata: string | null;
        createdAt: Date;
        updatedAt: Date;
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
        amount: import(".prisma/client/runtime/library").Decimal;
        currency: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string;
        providerTxId: string | null;
        metadata: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        enrollmentId: string | null;
        courseId: string;
    })[]>;
    stats(): import(".prisma/client").Prisma.PrismaPromise<unknown>;
    findMy(req: any): import(".prisma/client").Prisma.PrismaPromise<({
        course: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        amount: import(".prisma/client/runtime/library").Decimal;
        currency: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string;
        providerTxId: string | null;
        metadata: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        enrollmentId: string | null;
        courseId: string;
    })[]>;
    instructorStats(req: any): Promise<{
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
            amount: import(".prisma/client/runtime/library").Decimal;
            currency: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            method: import(".prisma/client").$Enums.PaymentMethod;
            reference: string;
            providerTxId: string | null;
            metadata: string | null;
            createdAt: Date;
            updatedAt: Date;
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
    instructorStudents(req: any): Promise<({
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
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        courseId: string;
        progress: number;
    })[]>;
    findByUserId(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
        course: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        amount: import(".prisma/client/runtime/library").Decimal;
        currency: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string;
        providerTxId: string | null;
        metadata: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        enrollmentId: string | null;
        courseId: string;
    })[]>;
}
