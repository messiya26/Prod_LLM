import { UsersService } from "./users.service";
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(page?: string, limit?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
    }[]>;
    count(): Promise<number>;
    getInvitations(): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        token: string;
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
        role: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatar: string | null;
        bio: string | null;
        role: import(".prisma/client").$Enums.Role;
        emailVerified: boolean;
    }>;
    findById(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        createdAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
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
}
