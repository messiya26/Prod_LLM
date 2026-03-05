import { BlogService } from "./blog.service";
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    findAll(): Promise<({
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
    findAllAdmin(): Promise<({
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
    create(req: any, body: any): Promise<{
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
    update(id: string, body: any): Promise<{
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
