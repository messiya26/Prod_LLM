import { PrismaService } from "../prisma";
import { CreateContactDto } from "./dto/contact.dto";
export declare class ContactService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateContactDto): import(".prisma/client").Prisma.Prisma__ContactMessageClient<{
        name: string;
        id: string;
        email: string;
        phone: string | null;
        createdAt: Date;
        message: string;
        read: boolean;
        userId: string | null;
        subject: string;
    }, never, import(".prisma/client/runtime/library").DefaultArgs>;
    findAll(page?: number, limit?: number): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        email: string;
        phone: string | null;
        createdAt: Date;
        message: string;
        read: boolean;
        userId: string | null;
        subject: string;
    }[]>;
    markAsRead(id: string): import(".prisma/client").Prisma.Prisma__ContactMessageClient<{
        name: string;
        id: string;
        email: string;
        phone: string | null;
        createdAt: Date;
        message: string;
        read: boolean;
        userId: string | null;
        subject: string;
    }, never, import(".prisma/client/runtime/library").DefaultArgs>;
}
