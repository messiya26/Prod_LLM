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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../prisma");
const mail_service_1 = require("../mail/mail.service");
const crypto = require("crypto");
let UsersService = class UsersService {
    constructor(prisma, mail) {
        this.prisma = prisma;
        this.mail = mail;
    }
    findAll(page = 1, limit = 20) {
        return this.prisma.user.findMany({
            skip: (page - 1) * limit,
            take: limit,
            select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
            orderBy: { createdAt: "desc" },
        });
    }
    findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true, role: true, createdAt: true, enrollments: { include: { course: { select: { id: true, title: true, slug: true, thumbnail: true } } } } },
        });
    }
    async count() {
        return this.prisma.user.count();
    }
    async updateRole(userId, role) {
        return this.prisma.user.update({ where: { id: userId }, data: { role } });
    }
    async inviteAdmin(email, role, inviterId) {
        const inviter = await this.prisma.user.findUnique({ where: { id: inviterId } });
        if (!inviter || inviter.role !== "ADMIN")
            throw new common_1.BadRequestException("Non autorise");
        const existing = await this.prisma.adminInvitation.findFirst({
            where: { email, accepted: false, expiresAt: { gt: new Date() } },
        });
        if (existing)
            throw new common_1.BadRequestException("Une invitation est deja en cours pour cet email");
        const token = crypto.randomBytes(32).toString("hex");
        await this.prisma.adminInvitation.create({
            data: {
                email,
                role,
                token,
                invitedBy: inviterId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        const inviterName = `${inviter.firstName} ${inviter.lastName}`;
        this.mail.sendAdminInvitation(email, inviterName, role, token).catch(() => { });
        return { message: "Invitation envoyee" };
    }
    async acceptInvitation(token) {
        const invitation = await this.prisma.adminInvitation.findUnique({ where: { token } });
        if (!invitation)
            throw new common_1.BadRequestException("Invitation invalide");
        if (invitation.accepted)
            throw new common_1.BadRequestException("Invitation deja acceptee");
        if (invitation.expiresAt < new Date())
            throw new common_1.BadRequestException("Invitation expiree");
        const user = await this.prisma.user.findUnique({ where: { email: invitation.email } });
        if (!user)
            throw new common_1.BadRequestException("Creez d'abord un compte avec cet email");
        await this.prisma.$transaction([
            this.prisma.user.update({ where: { id: user.id }, data: { role: invitation.role } }),
            this.prisma.adminInvitation.update({ where: { id: invitation.id }, data: { accepted: true } }),
        ]);
        return { message: "Invitation acceptee", role: invitation.role };
    }
    async getInvitations() {
        return this.prisma.adminInvitation.findMany({
            orderBy: { createdAt: "desc" },
            take: 50,
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService, mail_service_1.MailService])
], UsersService);
//# sourceMappingURL=users.service.js.map