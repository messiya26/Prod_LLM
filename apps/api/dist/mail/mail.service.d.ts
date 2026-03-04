import { OnModuleInit } from "@nestjs/common";
export declare function decodeVerifyToken(encoded: string): string | null;
export declare class MailService implements OnModuleInit {
    private transporter;
    private isEthereal;
    onModuleInit(): Promise<void>;
    private logPreviewUrl;
    private baseTemplate;
    sendVerificationEmail(to: string, firstName: string, token: string): Promise<boolean>;
    sendWelcomeEmail(to: string, firstName: string): Promise<boolean>;
    sendAdminInvitation(to: string, inviterName: string, role: string, token: string): Promise<boolean>;
    sendBookingConfirmation(to: string, name: string, date: string, slot: string, subject: string): Promise<boolean>;
    sendRegistrationConfirmation(to: string, data: {
        userName: string;
        eventTitle: string;
        eventDate: string;
        eventTime: string;
        eventLocation: string;
        type: "masterclass" | "course";
    }): Promise<boolean>;
}
