import { UsersService } from "./users.service";
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(page?: string, limit?: string): import(".prisma/client").Prisma.PrismaPromise<{
        firstName: string;
        lastName: string;
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }[]>;
    count(): Promise<number>;
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
}
