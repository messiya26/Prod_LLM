import { PrismaService } from "../prisma/prisma.service";
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: {
        title: string;
        message: string;
        type?: string;
        link?: string;
    }): import(".prisma/client").Prisma.Prisma__NotificationClient<{
        id: string;
        createdAt: Date;
        type: string;
        title: string;
        userId: string;
        message: string;
        read: boolean;
        link: string | null;
    }, never, import(".prisma/client/runtime/library").DefaultArgs>;
    findByUser(userId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        type: string;
        title: string;
        userId: string;
        message: string;
        read: boolean;
        link: string | null;
    }[]>;
    countUnread(userId: string): import(".prisma/client").Prisma.PrismaPromise<number>;
    markRead(id: string): import(".prisma/client").Prisma.Prisma__NotificationClient<{
        id: string;
        createdAt: Date;
        type: string;
        title: string;
        userId: string;
        message: string;
        read: boolean;
        link: string | null;
    }, never, import(".prisma/client/runtime/library").DefaultArgs>;
    markAllRead(userId: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
}
