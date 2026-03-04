import { PrismaService } from "../prisma";
export declare class EnrollmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    enroll(userId: string, courseIdOrSlug: string): Promise<{
        course: {
            id: string;
            title: string;
            slug: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        userId: string;
        courseId: string;
        progress: number;
    }>;
    activateAfterPayment(userId: string, courseIdOrSlug: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        userId: string;
        courseId: string;
        progress: number;
    }>;
    getMyEnrollments(userId: string): Promise<({
        course: {
            _count: {
                modules: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            published: boolean;
            description: string;
            thumbnail: string | null;
            level: import(".prisma/client").$Enums.Level;
            price: import(".prisma/client/runtime/library").Decimal;
            categoryId: string;
            instructorId: string | null;
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
    checkEnrolled(userId: string, courseIdOrSlug: string): Promise<{
        enrolled: boolean;
        id?: undefined;
        status?: undefined;
        progress?: undefined;
    } | {
        enrolled: boolean;
        id: string;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        progress: number;
    }>;
    updateProgress(userId: string, courseId: string, progress: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        userId: string;
        courseId: string;
        progress: number;
    }>;
    getRecentEnrollments(): Promise<({
        user: {
            firstName: string;
            lastName: string;
        };
        course: {
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
