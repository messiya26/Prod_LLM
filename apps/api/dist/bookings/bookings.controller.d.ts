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
        id: string;
        email: string;
        phone: string | null;
        createdAt: Date;
        userId: string | null;
        date: Date;
        slot: string;
        subject: string;
        notes: string | null;
        status: string;
    }>;
    getAvailableSlots(date: string): Promise<string[]>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        name: string;
        id: string;
        email: string;
        phone: string | null;
        createdAt: Date;
        userId: string | null;
        date: Date;
        slot: string;
        subject: string;
        notes: string | null;
        status: string;
    })[]>;
    updateStatus(id: string, dto: {
        status: string;
    }): import(".prisma/client").Prisma.Prisma__BookingClient<{
        name: string;
        id: string;
        email: string;
        phone: string | null;
        createdAt: Date;
        userId: string | null;
        date: Date;
        slot: string;
        subject: string;
        notes: string | null;
        status: string;
    }, never, import(".prisma/client/runtime/library").DefaultArgs>;
}
