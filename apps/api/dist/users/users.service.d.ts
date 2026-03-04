import { PrismaService } from "../prisma";
import { MailService } from "../mail/mail.service";
export declare class UsersService {
    private prisma;
    private mail;
    constructor(prisma: PrismaService, mail: MailService);
    findAll(page?: number, limit?: number): import(".prisma/client").Prisma.PrismaPromise<{
        firstName: string;
        lastName: string;
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }[]>;
    findById(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        id: string;
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
            userId: string;
            courseId: string;
            status: import(".prisma/client").$Enums.EnrollmentStatus;
            progress: number;
        })[];
    } | null, null, import(".prisma/client/runtime/library").DefaultArgs>;
    count(): Promise<number>;
    updateRole(userId: string, role: "STUDENT" | "INSTRUCTOR" | "ADMIN"): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        id: string;
        passwordHash: string;
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
        token: string;
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        expiresAt: Date;
        invitedBy: string;
        accepted: boolean;
    }[]>;
}
