"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const crypto_1 = require("crypto");
let InvitationsService = class InvitationsService {
    constructor(prisma, mail) {
        this.prisma = prisma;
        this.mail = mail;
    }
    async invite(invitedById, email, role) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing)
            throw new common_1.ConflictException("Cet utilisateur existe deja");
        const token = (0, crypto_1.randomBytes)(32).toString("hex");
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const invitation = await this.prisma.invitation.create({
            data: { email, role: role, token, invitedById, expiresAt },
            include: { invitedBy: { select: { firstName: true, lastName: true } } },
        });
        const inviterName = `${invitation.invitedBy.firstName} ${invitation.invitedBy.lastName}`;
        try {
            await this.mail.sendAdminInvitation(email, inviterName, role, token);
        }
        catch { }
        return invitation;
    }
    async findAll() {
        return this.prisma.invitation.findMany({
            orderBy: { createdAt: "desc" },
            include: { invitedBy: { select: { firstName: true, lastName: true } } },
        });
    }
    async findByToken(token) {
        return this.prisma.invitation.findUnique({ where: { token } });
    }
    async accept(token) {
        const inv = await this.prisma.invitation.findUnique({ where: { token } });
        if (!inv || inv.accepted || inv.expiresAt < new Date())
            return null;
        await this.prisma.invitation.update({
            where: { id: inv.id },
            data: { accepted: true },
        });
        return inv;
    }
    async delete(id) {
        return this.prisma.invitation.delete({ where: { id } });
    }
    async resend(id) {
        const inv = await this.prisma.invitation.findUnique({
            where: { id },
            include: { invitedBy: { select: { firstName: true, lastName: true } } },
        });
        if (!inv)
            return null;
        const newToken = (0, crypto_1.randomBytes)(32).toString("hex");
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.prisma.invitation.update({ where: { id }, data: { token: newToken, expiresAt } });
        const inviterName = `${inv.invitedBy.firstName} ${inv.invitedBy.lastName}`;
        try {
            await this.mail.sendAdminInvitation(inv.email, inviterName, inv.role, newToken);
        }
        catch { }
        return { success: true };
    }
};
exports.InvitationsService = InvitationsService;
exports.InvitationsService = InvitationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], InvitationsService);
//# sourceMappingURL=invitations.service.js.map