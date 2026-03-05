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
        createdAt: Date;
        status: string;
        userId: string | null;
        email: string;
        phone: string | null;
        subject: string;
        date: Date;
        slot: string;
        notes: string | null;
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
        createdAt: Date;
        status: string;
        userId: string | null;
        email: string;
        phone: string | null;
        subject: string;
        date: Date;
        slot: string;
        notes: string | null;
    })[]>;
    updateStatus(id: string, dto: {
        status: string;
    }): import(".prisma/client").Prisma.Prisma__BookingClient<{
        id: string;
        name: string;
        createdAt: Date;
        status: string;
        userId: string | null;
        email: string;
        phone: string | null;
        subject: string;
        date: Date;
        slot: string;
        notes: string | null;
    }, never, import(".prisma/client/runtime/library").DefaultArgs>;
}
