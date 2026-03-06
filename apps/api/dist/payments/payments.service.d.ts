import { PrismaService } from "../prisma/prisma.service";
import { MailService } from "../mail/mail.service";
export declare class PaymentsService {
    private prisma;
    private mail;
    constructor(prisma: PrismaService, mail: MailService);
    private mapMethod;
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
            title: string;
            slug: string;
            description: string;
            thumbnail: string | null;
            level: import(".prisma/client").$Enums.Level;
            price: import(".prisma/client/runtime/library").Decimal;
            instructorId: string | null;
            createdAt: Date;
            updatedAt: Date;
            published: boolean;
            categoryId: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import(".prisma/client/runtime/library").Decimal;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string;
        providerTxId: string | null;
        metadata: string | null;
        enrollmentId: string | null;
        courseId: string;
    }>;
    confirm(reference: string): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
        };
        course: {
            title: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import(".prisma/client/runtime/library").Decimal;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string;
        providerTxId: string | null;
        metadata: string | null;
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
        status: import(".prisma/client").$Enums.PaymentStatus;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import(".prisma/client/runtime/library").Decimal;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string;
        providerTxId: string | null;
        metadata: string | null;
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
        status: import(".prisma/client").$Enums.PaymentStatus;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import(".prisma/client/runtime/library").Decimal;
        method: import(".prisma/client").$Enums.PaymentMethod;
        reference: string;
        providerTxId: string | null;
        metadata: string | null;
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
            status: import(".prisma/client").$Enums.PaymentStatus;
            currency: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            amount: import(".prisma/client/runtime/library").Decimal;
            method: import(".prisma/client").$Enums.PaymentMethod;
            reference: string;
            providerTxId: string | null;
            metadata: string | null;
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
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        courseId: string;
        progress: number;
    })[]>;
}
