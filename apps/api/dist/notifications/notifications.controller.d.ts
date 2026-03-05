import { NotificationsService } from "./notifications.service";
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    findMy(req: any): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        type: string;
        read: boolean;
        link: string | null;
    }[]>;
    countUnread(req: any): import(".prisma/client").Prisma.PrismaPromise<number>;
    markRead(id: string): import(".prisma/client").Prisma.Prisma__NotificationClient<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        type: string;
        read: boolean;
        link: string | null;
    }, never, import(".prisma/client/runtime/library").DefaultArgs>;
    markAllRead(req: any): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
}
