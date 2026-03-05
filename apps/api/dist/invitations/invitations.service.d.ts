import { PrismaService } from "../prisma/prisma.service";
import { MailService } from "../mail/mail.service";
export declare class InvitationsService {
    private prisma;
    private mail;
    constructor(prisma: PrismaService, mail: MailService);
    invite(invitedById: string, email: string, role: string): Promise<{
        invitedBy: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        token: string;
        expiresAt: Date;
        accepted: boolean;
        invitedById: string;
    }>;
    findAll(): Promise<({
        invitedBy: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        token: string;
        expiresAt: Date;
        accepted: boolean;
        invitedById: string;
    })[]>;
    findByToken(token: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        token: string;
        expiresAt: Date;
        accepted: boolean;
        invitedById: string;
    } | null>;
    accept(token: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        token: string;
        expiresAt: Date;
        accepted: boolean;
        invitedById: string;
    } | null>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        token: string;
        expiresAt: Date;
        accepted: boolean;
        invitedById: string;
    }>;
    resend(id: string): Promise<{
        success: boolean;
    } | null>;
}
