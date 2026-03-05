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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        image: string | null;
        category: string;
        tags: string | null;
        published: boolean;
        authorId: string;
    }>;
    findAll(publishedOnly?: boolean): Promise<({
        author: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        image: string | null;
        category: string;
        tags: string | null;
        published: boolean;
        authorId: string;
    })[]>;
    findBySlug(slug: string): Promise<({
        author: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        image: string | null;
        category: string;
        tags: string | null;
        published: boolean;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        image: string | null;
        category: string;
        tags: string | null;
        published: boolean;
        authorId: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        image: string | null;
        category: string;
        tags: string | null;
        published: boolean;
        authorId: string;
    }>;
}
