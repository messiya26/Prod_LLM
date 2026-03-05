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
    findAllAdmin(): Promise<({
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
    create(req: any, body: any): Promise<{
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
    update(id: string, body: any): Promise<{
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
