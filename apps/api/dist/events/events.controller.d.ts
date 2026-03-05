import { EventsService } from "./events.service";
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
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
