import { InvitationsService } from "./invitations.service";
export declare class InvitationsController {
    private readonly invitationsService;
    constructor(invitationsService: InvitationsService);
    invite(req: any, body: {
        email: string;
        role: string;
    }): Promise<{
        invitedBy: {
            firstName: string;
            lastName: string;
        };
    } & {
        token: string;
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
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
        token: string;
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        expiresAt: Date;
        accepted: boolean;
        invitedById: string;
    })[]>;
    resend(id: string): Promise<{
        success: boolean;
    } | null>;
    delete(id: string): Promise<{
        token: string;
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        expiresAt: Date;
        accepted: boolean;
        invitedById: string;
    }>;
    findByToken(token: string): Promise<{
        token: string;
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        expiresAt: Date;
        accepted: boolean;
        invitedById: string;
    } | null>;
    accept(token: string): Promise<{
        token: string;
        email: string;
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        expiresAt: Date;
        accepted: boolean;
        invitedById: string;
    } | null>;
}
