import { PrismaService } from "../prisma/prisma.service";
export declare class EventsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(authorId: string, data: {
        title: string;
        slug?: string;
        description: string;
        image?: string;
        location?: string;
        isOnline?: boolean;
        link?: string;
        date: string;
        endDate?: string;
        price?: number;
        capacity?: number;
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
        link: string | null;
        slug: string;
        image: string | null;
        published: boolean;
        authorId: string;
        date: Date;
        description: string;
        price: number;
        location: string | null;
        isOnline: boolean;
        endDate: Date | null;
        capacity: number | null;
        registrations: number;
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
        link: string | null;
        slug: string;
        image: string | null;
        published: boolean;
        authorId: string;
        date: Date;
        description: string;
        price: number;
        location: string | null;
        isOnline: boolean;
        endDate: Date | null;
        capacity: number | null;
        registrations: number;
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
        link: string | null;
        slug: string;
        image: string | null;
        published: boolean;
        authorId: string;
        date: Date;
        description: string;
        price: number;
        location: string | null;
        isOnline: boolean;
        endDate: Date | null;
        capacity: number | null;
        registrations: number;
    }) | null>;
    update(id: string, data: any): Promise<{
        author: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        link: string | null;
        slug: string;
        image: string | null;
        published: boolean;
        authorId: string;
        date: Date;
        description: string;
        price: number;
        location: string | null;
        isOnline: boolean;
        endDate: Date | null;
        capacity: number | null;
        registrations: number;
    }>;
    register(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        link: string | null;
        slug: string;
        image: string | null;
        published: boolean;
        authorId: string;
        date: Date;
        description: string;
        price: number;
        location: string | null;
        isOnline: boolean;
        endDate: Date | null;
        capacity: number | null;
        registrations: number;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        link: string | null;
        slug: string;
        image: string | null;
        published: boolean;
        authorId: string;
        date: Date;
        description: string;
        price: number;
        location: string | null;
        isOnline: boolean;
        endDate: Date | null;
        capacity: number | null;
        registrations: number;
    }>;
}
