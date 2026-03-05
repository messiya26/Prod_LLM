import { CoursesService } from "./courses.service";
import { CreateCourseDto, UpdateCourseDto } from "./dto/course.dto";
export declare class CoursesController {
    private coursesService;
    constructor(coursesService: CoursesService);
    findAll(published?: string): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            enrollments: number;
            modules: number;
        };
        category: {
            name: string;
            id: string;
            slug: string;
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
        published: boolean;
        description: string;
        thumbnail: string | null;
        level: import(".prisma/client").$Enums.Level;
        price: import(".prisma/client/runtime/library").Decimal;
        categoryId: string;
        instructorId: string | null;
    })[]>;
    getCategories(): Promise<({
        _count: {
            courses: number;
        };
    } & {
        name: string;
        id: string;
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
        _count: {
            enrollments: number;
        };
        category: {
            name: string;
            id: string;
            slug: string;
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
                content: string | null;
                order: number;
                muxAssetId: string | null;
                muxPlaybackId: string | null;
                duration: number | null;
                moduleId: string;
            }[];
        } & {
            id: string;
            title: string;
            courseId: string;
            order: number;
        })[];
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
    }>;
    create(dto: CreateCourseDto): Promise<{
        category: {
            name: string;
            id: string;
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
        published: boolean;
        description: string;
        thumbnail: string | null;
        level: import(".prisma/client").$Enums.Level;
        price: import(".prisma/client/runtime/library").Decimal;
        categoryId: string;
        instructorId: string | null;
    }>;
    update(id: string, dto: UpdateCourseDto): Promise<{
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
    }>;
    togglePublish(id: string): Promise<{
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
    }>;
    delete(id: string): Promise<{
        deleted: boolean;
    }>;
}
