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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const prisma_1 = require("../prisma");
const mail_service_1 = require("../mail/mail.service");
const notifications_service_1 = require("../notifications/notifications.service");
let AuthService = class AuthService {
    constructor(prisma, jwt, mail, notifications) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.mail = mail;
        this.notifications = notifications;
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException("Cet email est deja utilise");
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
                phone: dto.phone,
                emailVerified: false,
            },
        });
        const token = crypto.randomBytes(32).toString("hex");
        await this.prisma.verificationToken.create({
            data: {
                token,
                email: user.email,
                type: "EMAIL_VERIFICATION",
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });
        this.mail.sendVerificationEmail(user.email, user.firstName, token).catch(() => { });
        this.notifications.create(user.id, {
            title: "Bienvenue sur Lord Lombo Academy !",
            message: `Bonjour ${user.firstName}, votre compte a ete cree avec succes. Verifiez votre email pour activer toutes les fonctionnalites.`,
            type: "welcome",
            link: "/dashboard",
        }).catch(() => { });
        const tokens = await this.generateTokens(user.id, user.email);
        return {
            user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, emailVerified: false },
            ...tokens,
            message: "Un email de verification a ete envoye a votre adresse.",
        };
    }
    async verifyEmail(encodedRef) {
        const rawToken = (0, mail_service_1.decodeVerifyToken)(encodedRef);
        if (!rawToken)
            throw new common_1.BadRequestException("Lien de verification invalide ou corrompu");
        const record = await this.prisma.verificationToken.findUnique({ where: { token: rawToken } });
        if (!record)
            throw new common_1.BadRequestException("Lien de verification invalide");
        if (record.used)
            throw new common_1.BadRequestException("Ce lien a deja ete utilise");
        if (record.expiresAt < new Date())
            throw new common_1.BadRequestException("Ce lien a expire. Veuillez demander un nouveau lien.");
        await this.prisma.verificationToken.update({ where: { id: record.id }, data: { used: true } });
        const user = await this.prisma.user.update({
            where: { email: record.email },
            data: { emailVerified: true },
        });
        this.mail.sendWelcomeEmail(user.email, user.firstName).catch(() => { });
        const tokens = await this.generateTokens(user.id, user.email);
        return {
            user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, emailVerified: true },
            ...tokens,
            message: "Votre compte a ete verifie avec succes !",
        };
    }
    async resendVerification(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.BadRequestException("Aucun compte associe a cet email");
        if (user.emailVerified)
            throw new common_1.BadRequestException("Cet email est deja verifie");
        await this.prisma.verificationToken.updateMany({
            where: { email, used: false },
            data: { used: true },
        });
        const token = crypto.randomBytes(32).toString("hex");
        await this.prisma.verificationToken.create({
            data: {
                token,
                email,
                type: "EMAIL_VERIFICATION",
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });
        this.mail.sendVerificationEmail(email, user.firstName, token).catch(() => { });
        return { message: "Un nouveau lien de verification a ete envoye." };
    }
    async login(dto, ip, userAgent) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user)
            throw new common_1.UnauthorizedException("Email ou mot de passe incorrect");
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException("Email ou mot de passe incorrect");
        this.notifications.create(user.id, {
            title: "Nouvelle connexion detectee",
            message: `Connexion a votre compte le ${new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}. Si ce n'est pas vous, changez votre mot de passe immediatement.`,
            type: "security",
            link: "/dashboard/parametres",
        }).catch(() => { });
        this.mail.sendLoginNotification(user.email, {
            userName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
            device: this.parseDevice(userAgent || ""),
            ip: ip || "inconnue",
            date: new Date().toLocaleString("fr-FR"),
        }).catch(() => { });
        const tokens = await this.generateTokens(user.id, user.email);
        return {
            user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, emailVerified: user.emailVerified },
            ...tokens,
        };
    }
    parseDevice(ua) {
        if (/mobile|android|iphone/i.test(ua))
            return "Mobile";
        if (/tablet|ipad/i.test(ua))
            return "Tablette";
        if (/chrome/i.test(ua))
            return "Chrome (Ordinateur)";
        if (/firefox/i.test(ua))
            return "Firefox (Ordinateur)";
        if (/safari/i.test(ua))
            return "Safari (Ordinateur)";
        return "Navigateur";
    }
    async googleLogin(googleUser) {
        let user = await this.prisma.user.findUnique({ where: { email: googleUser.email } });
        if (!user) {
            const passwordHash = await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 12);
            user = await this.prisma.user.create({
                data: {
                    email: googleUser.email,
                    firstName: googleUser.firstName,
                    lastName: googleUser.lastName,
                    avatar: googleUser.avatar,
                    passwordHash,
                    emailVerified: true,
                },
            });
            this.mail.sendWelcomeEmail(user.email, user.firstName).catch(() => { });
            this.notifications.create(user.id, {
                title: "Bienvenue sur Lord Lombo Academy !",
                message: `Bonjour ${user.firstName}, votre compte a ete cree via Google. Explorez nos formations des maintenant !`,
                type: "welcome",
                link: "/formations",
            }).catch(() => { });
        }
        else if (!user.emailVerified) {
            await this.prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } });
        }
        this.notifications.create(user.id, {
            title: "Connexion Google detectee",
            message: `Connexion via Google le ${new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}.`,
            type: "security",
            link: "/dashboard/parametres",
        }).catch(() => { });
        const tokens = await this.generateTokens(user.id, user.email);
        return {
            user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, emailVerified: true },
            ...tokens,
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true, role: true, emailVerified: true, createdAt: true },
        });
        if (!user)
            throw new common_1.UnauthorizedException();
        return user;
    }
    async updateProfile(userId, data) {
        const updateData = {};
        if (data.firstName?.trim())
            updateData.firstName = data.firstName.trim();
        if (data.lastName?.trim())
            updateData.lastName = data.lastName.trim();
        if (data.phone !== undefined)
            updateData.phone = data.phone.trim() || null;
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true, role: true, emailVerified: true, createdAt: true },
        });
        return user;
    }
    async promoteToAdmin(userId, currentUserId) {
        const currentUser = await this.prisma.user.findUnique({ where: { id: currentUserId } });
        if (!currentUser || currentUser.role !== "ADMIN")
            throw new common_1.UnauthorizedException("Seul un admin peut promouvoir un utilisateur");
        return this.prisma.user.update({
            where: { id: userId },
            data: { role: "ADMIN" },
            select: { id: true, email: true, firstName: true, lastName: true, role: true },
        });
    }
    async changeRole(userId, role, currentUserId) {
        const currentUser = await this.prisma.user.findUnique({ where: { id: currentUserId } });
        if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "SUPER_ADMIN"))
            throw new common_1.UnauthorizedException("Seul un admin peut modifier les roles");
        return this.prisma.user.update({
            where: { id: userId },
            data: { role },
            select: { id: true, email: true, firstName: true, lastName: true, role: true },
        });
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            return { message: "Si un compte existe avec cet email, un code de reinitialisation a ete envoye." };
        await this.prisma.verificationToken.updateMany({
            where: { email, type: "PASSWORD_RESET", used: false },
            data: { used: true },
        });
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await this.prisma.verificationToken.create({
            data: {
                token: code,
                email,
                type: "PASSWORD_RESET",
                expiresAt: new Date(Date.now() + 15 * 60 * 1000),
            },
        });
        this.mail.sendPasswordResetCode(email, user.firstName, code).catch(() => { });
        return { message: "Si un compte existe avec cet email, un code de reinitialisation a ete envoye." };
    }
    async resetPassword(email, code, newPassword) {
        const record = await this.prisma.verificationToken.findFirst({
            where: { email, token: code, type: "PASSWORD_RESET", used: false },
            orderBy: { createdAt: "desc" },
        });
        if (!record)
            throw new common_1.BadRequestException("Code invalide ou expire");
        if (record.expiresAt < new Date())
            throw new common_1.BadRequestException("Code expire. Veuillez en demander un nouveau.");
        const passwordHash = await bcrypt.hash(newPassword, 12);
        await this.prisma.user.update({ where: { email }, data: { passwordHash } });
        await this.prisma.verificationToken.update({ where: { id: record.id }, data: { used: true } });
        this.notifications.create((await this.prisma.user.findUnique({ where: { email } })).id, { title: "Mot de passe modifie", message: "Votre mot de passe a ete reinitialise avec succes.", type: "security", link: "/dashboard/parametres" }).catch(() => { });
        return { message: "Mot de passe reinitialise avec succes." };
    }
    async generateTokens(userId, email) {
        const payload = { sub: userId, email };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync(payload, { expiresIn: "1d" }),
            this.jwt.signAsync(payload, { expiresIn: "7d" }),
        ]);
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService,
        jwt_1.JwtService,
        mail_service_1.MailService,
        notifications_service_1.NotificationsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map