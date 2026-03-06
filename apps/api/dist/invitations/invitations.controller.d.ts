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
        id: string;
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        token: string;
        accepted: boolean;
        expiresAt: Date;
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
        accepted: boolean;
        expiresAt: Date;
        invitedById: string;
    })[]>;
    resend(id: string): Promise<{
        success: boolean;
    } | null>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        token: string;
        accepted: boolean;
        expiresAt: Date;
        invitedById: string;
    }>;
    findByToken(token: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        token: string;
        accepted: boolean;
        expiresAt: Date;
        invitedById: string;
    } | null>;
    accept(token: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        token: string;
        accepted: boolean;
        expiresAt: Date;
        invitedById: string;
    } | null>;
}
