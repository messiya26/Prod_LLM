import { PrismaService } from "../prisma/prisma.service";
export declare class BlogService {
    private prisma;
    constructor(prisma: PrismaService);
    create(authorId: string, data: {
        title: string;
        slug?: string;
        excerpt?: string;
        content: string;
        image?: string;
        category?: string;
        tags?: string;
        published?: boolean;
    }): Promise<{
        author: {
            firstName: string;
            lastName: string;
        };
    } & {
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        published: boolean;
        content: string;
        excerpt: string | null;
        image: string | null;
        tags: string | null;
        authorId: string;
    }>;
    findAll(publishedOnly?: boolean): Promise<({
        author: {
            firstName: string;
            lastName: string;
        };
    } & {
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        published: boolean;
        content: string;
        excerpt: string | null;
        image: string | null;
        tags: string | null;
        authorId: string;
    })[]>;
    findBySlug(slug: string): Promise<({
        author: {
            firstName: string;
            lastName: string;
        };
    } & {
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        published: boolean;
        content: string;
        excerpt: string | null;
        image: string | null;
        tags: string | null;
        authorId: string;
    }) | null>;
    update(id: string, data: Partial<{
        title: string;
        slug: string;
        excerpt: string;
        content: string;
        image: string;
        category: string;
        tags: string;
        published: boolean;
    }>): Promise<{
        author: {
            firstName: string;
            lastName: string;
        };
    } & {
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        published: boolean;
        content: string;
        excerpt: string | null;
        image: string | null;
        tags: string | null;
        authorId: string;
    }>;
    delete(id: string): Promise<{
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        published: boolean;
        content: string;
        excerpt: string | null;
        image: string | null;
        tags: string | null;
        authorId: string;
    }>;
}
