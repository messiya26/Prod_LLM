import { CoursesService } from "./courses.service";
import { CreateCourseDto, UpdateCourseDto } from "./dto/course.dto";
export declare class CoursesController {
    private coursesService;
    constructor(coursesService: CoursesService);
    findAll(published?: string): import(".prisma/client").Prisma.PrismaPromise<({
        category: {
            id: string;
            name: string;
            slug: string;
        };
        _count: {
            enrollments: number;
            modules: number;
        };
        instructor: {
            id: string;
            firstName: string;
            lastName: string;
            avatar: string | null;
            bio: string | null;
        } | null;
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
    })[]>;
    getCategories(): Promise<({
        _count: {
            courses: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
    })[]>;
    getInstructors(): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string | null;
        bio: string | null;
        role: import(".prisma/client").$Enums.Role;
        _count: {
            courses: number;
        };
    }[]>;
    findBySlug(slug: string): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
        };
        _count: {
            enrollments: number;
        };
        instructor: {
            id: string;
            firstName: string;
            lastName: string;
            avatar: string | null;
            bio: string | null;
        } | null;
        modules: ({
            lessons: {
                id: string;
                title: string;
                order: number;
                duration: number | null;
                moduleId: string;
                content: string | null;
                muxAssetId: string | null;
                muxPlaybackId: string | null;
            }[];
        } & {
            id: string;
            courseId: string;
            title: string;
            order: number;
        })[];
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
    }>;
    create(dto: CreateCourseDto): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
        };
        instructor: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
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
    }>;
    update(id: string, dto: UpdateCourseDto): Promise<{
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
    }>;
    togglePublish(id: string): Promise<{
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
    }>;
    delete(id: string): Promise<{
        deleted: boolean;
    }>;
}
