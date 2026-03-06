import { PrismaService } from "../prisma/prisma.service";
import { MailService } from "../mail/mail.service";
export declare class BookingsService {
    private prisma;
    private mail;
    constructor(prisma: PrismaService, mail: MailService);
    create(dto: {
        name: string;
        email: string;
        phone?: string;
        date: string;
        slot: string;
        subject: string;
        notes?: string;
        userId?: string;
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
    findByDate(date: string): import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    getAvailableSlots(date: string): Promise<string[]>;
    updateStatus(id: string, status: string): import(".prisma/client").Prisma.Prisma__BookingClient<{
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
