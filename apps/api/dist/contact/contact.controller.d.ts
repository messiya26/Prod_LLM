import { ContactService } from "./contact.service";
import { CreateContactDto } from "./dto/contact.dto";
export declare class ContactController {
    private contactService;
    constructor(contactService: ContactService);
    create(dto: CreateContactDto): import(".prisma/client").Prisma.Prisma__ContactMessageClient<{
        name: string;
        subject: string;
        email: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        userId: string | null;
        message: string;
        read: boolean;
    }, never, import(".prisma/client/runtime/library").DefaultArgs>;
    findAll(page?: string, limit?: string): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        subject: string;
        email: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        userId: string | null;
        message: string;
        read: boolean;
    }[]>;
    markAsRead(id: string): import(".prisma/client").Prisma.Prisma__ContactMessageClient<{
        name: string;
        subject: string;
        email: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        userId: string | null;
        message: string;
        read: boolean;
    }, never, import(".prisma/client/runtime/library").DefaultArgs>;
}
