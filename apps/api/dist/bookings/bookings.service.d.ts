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
    findByDate(date: string): import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    getAvailableSlots(date: string): Promise<string[]>;
    updateStatus(id: string, status: string): import(".prisma/client").Prisma.Prisma__BookingClient<{
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
