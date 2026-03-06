import { BookingsService } from "./bookings.service";
export declare class BookingsController {
    private bookingsService;
    constructor(bookingsService: BookingsService);
    create(dto: {
        name: string;
        email: string;
        phone?: string;
        date: string;
        slot: string;
        subject: string;
        notes?: string;
    }): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        date: Date;
        slot: string;
        subject: string;
        notes: string | null;
        status: string;
        createdAt: Date;
        userId: string | null;
    }>;
    getAvailableSlots(date: string): Promise<string[]>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        date: Date;
        slot: string;
        subject: string;
        notes: string | null;
        status: string;
        createdAt: Date;
        userId: string | null;
    })[]>;
    updateStatus(id: string, dto: {
        status: string;
    }): import(".prisma/client").Prisma.Prisma__BookingClient<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        date: Date;
        slot: string;
        subject: string;
        notes: string | null;
        status: string;
        createdAt: Date;
        userId: string | null;
    }, never, import(".prisma/client/runtime/library").DefaultArgs>;
}
