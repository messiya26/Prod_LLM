import { UsersService } from "./users.service";
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(page?: string, limit?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }[]>;
    count(): Promise<number>;
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
    invite(body: {
        email: string;
        role: "INSTRUCTOR" | "ADMIN";
    }, req: any): Promise<{
        message: string;
    }>;
    acceptInvitation(body: {
        token: string;
    }): Promise<{
        message: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    updateRole(id: string, body: {
        role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
    }): Promise<{
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
            userId: string;
            status: import(".prisma/client").$Enums.EnrollmentStatus;
            courseId: string;
            progress: number;
        })[];
    } | null, null, import(".prisma/client/runtime/library").DefaultArgs>;
}
