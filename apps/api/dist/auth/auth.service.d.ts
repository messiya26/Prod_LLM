import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma";
import { MailService } from "../mail/mail.service";
import { NotificationsService } from "../notifications/notifications.service";
import { RegisterDto, LoginDto } from "./dto/auth.dto";
export declare class AuthService {
    private prisma;
    private jwt;
    private mail;
    private notifications;
    constructor(prisma: PrismaService, jwt: JwtService, mail: MailService, notifications: NotificationsService);
    register(dto: RegisterDto): Promise<{
        message: string;
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            emailVerified: boolean;
        };
    }>;
    verifyEmail(encodedRef: string): Promise<{
        message: string;
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            emailVerified: boolean;
        };
    }>;
    resendVerification(email: string): Promise<{
        message: string;
    }>;
    login(dto: LoginDto, ip?: string, userAgent?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            emailVerified: boolean;
        };
    }>;
    private parseDevice;
    googleLogin(googleUser: {
        email: string;
        firstName: string;
        lastName: string;
        avatar: string | null;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            emailVerified: boolean;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        emailVerified: boolean;
    }>;
    updateProfile(userId: string, data: {
        firstName?: string;
        lastName?: string;
        phone?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        emailVerified: boolean;
    }>;
    promoteToAdmin(userId: string, currentUserId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    changeRole(userId: string, role: "STUDENT" | "INSTRUCTOR" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN", currentUserId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    private generateTokens;
}
