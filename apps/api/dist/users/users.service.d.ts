import { PrismaService } from "../prisma";
import { MailService } from "../mail/mail.service";
export declare class UsersService {
    private prisma;
    private mail;
    constructor(prisma: PrismaService, mail: MailService);
    findAll(page?: number, limit?: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }[]>;
    findById(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        enrollments: ({
            course: {
                id: string;
                title: string;
                slug: string;
                thumbnail: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.EnrollmentStatus;
            userId: string;
            courseId: string;
            progress: number;
        })[];
    } | null, null, import(".prisma/client/runtime/library").DefaultArgs>;
    count(): Promise<number>;
    updateRole(userId: string, role: "STUDENT" | "INSTRUCTOR" | "ADMIN"): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatar: string | null;
        bio: string | null;
        role: import(".prisma/client").$Enums.Role;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    inviteAdmin(email: string, role: "INSTRUCTOR" | "ADMIN", inviterId: string): Promise<{
        message: string;
    }>;
    acceptInvitation(token: string): Promise<{
        message: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    getInvitations(): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        token: string;
        expiresAt: Date;
        accepted: boolean;
        invitedBy: string;
    }[]>;
}
