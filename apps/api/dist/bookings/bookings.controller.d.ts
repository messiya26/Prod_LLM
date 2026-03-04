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
        name: string;
        subject: string;
        date: Date;
        email: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        userId: string | null;
        status: string;
        slot: string;
        notes: string | null;
    }>;
    getAvailableSlots(date: string): Promise<string[]>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            firstName: string;
            lastName: string;
            id: string;
        } | null;
    } & {
        name: string;
        subject: string;
        date: Date;
        email: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        userId: string | null;
        status: string;
        slot: string;
        notes: string | null;
    })[]>;
    updateStatus(id: string, dto: {
        status: string;
    }): import(".prisma/client").Prisma.Prisma__BookingClient<{
        name: string;
        subject: string;
        date: Date;
        email: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        userId: string | null;
        status: string;
        slot: string;
        notes: string | null;
    }, never, import(".prisma/client/runtime/library").DefaultArgs>;
}
