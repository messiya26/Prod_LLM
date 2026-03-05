import { EnrollmentsService } from "./enrollments.service";
export declare class EnrollmentsController {
    private enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
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
    enroll(req: any, courseId: string): Promise<{
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
    activate(req: any, slug: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        userId: string;
        courseId: string;
        progress: number;
    }>;
    checkEnrolled(req: any, slug: string): Promise<{
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
    getMyEnrollments(req: any): Promise<({
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
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        userId: string;
        courseId: string;
        progress: number;
    })[]>;
    updateProgress(req: any, courseId: string, progress: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        userId: string;
        courseId: string;
        progress: number;
    }>;
}
