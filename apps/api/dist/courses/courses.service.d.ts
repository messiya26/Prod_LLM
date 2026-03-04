import { PrismaService } from "../prisma";
import { CreateCourseDto, UpdateCourseDto } from "./dto/course.dto";
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(published?: boolean): import(".prisma/client").Prisma.PrismaPromise<({
        category: {
            name: string;
            id: string;
            slug: string;
        };
        _count: {
            enrollments: number;
            modules: number;
        };
        instructor: {
            firstName: string;
            lastName: string;
            id: string;
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
    findBySlug(slug: string): Promise<{
        category: {
            name: string;
            id: string;
            slug: string;
        };
        _count: {
            enrollments: number;
        };
        instructor: {
            firstName: string;
            lastName: string;
            id: string;
            avatar: string | null;
            bio: string | null;
        } | null;
        modules: ({
            lessons: {
                id: string;
                title: string;
                order: number;
                content: string | null;
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
            name: string;
            id: string;
            slug: string;
        };
        instructor: {
            firstName: string;
            lastName: string;
            id: string;
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
    delete(id: string): Promise<{
        deleted: boolean;
    }>;
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
        firstName: string;
        lastName: string;
        email: string;
        id: string;
        avatar: string | null;
        bio: string | null;
        role: import(".prisma/client").$Enums.Role;
        _count: {
            courses: number;
        };
    }[]>;
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
}
