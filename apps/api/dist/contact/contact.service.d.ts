import { PrismaService } from "../prisma";
import { CreateContactDto } from "./dto/contact.dto";
export declare class ContactService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateContactDto): import(".prisma/client").Prisma.Prisma__ContactMessageClient<{
        id: string;
        name: string;
        createdAt: Date;
        userId: string | null;
        email: string;
        phone: string | null;
        message: string;
        read: boolean;
        subject: string;
    }, never, import(".prisma/client/runtime/library").DefaultArgs>;
    findAll(page?: number, limit?: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        userId: string | null;
        email: string;
        phone: string | null;
        message: string;
        read: boolean;
        subject: string;
    }[]>;
    markAsRead(id: string): import(".prisma/client").Prisma.Prisma__ContactMessageClient<{
        id: string;
        name: string;
        createdAt: Date;
        userId: string | null;
        email: string;
        phone: string | null;
        message: string;
        read: boolean;
        subject: string;
    }, never, import(".prisma/client/runtime/library").DefaultArgs>;
}
