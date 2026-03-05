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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../auth/guards/public.decorator");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcryptjs");
let HealthController = class HealthController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    check() {
        return { status: "ok", timestamp: new Date().toISOString(), service: "Lord Lombo Academie API" };
    }
    async seed(secret) {
        if (secret !== "LLM2026SeedNow!")
            throw new common_1.UnauthorizedException("Invalid secret");
        const adminHash = await bcrypt.hash("Admin2026!", 12);
        const studentHash = await bcrypt.hash("Student2026!", 12);
        const instructorHash = await bcrypt.hash("Instructor2026!", 12);
        const modHash = await bcrypt.hash("Moderateur2026!", 12);
        const superHash = await bcrypt.hash("SuperAdmin2026!", 12);
        await this.prisma.user.upsert({
            where: { email: "admin@lordlomboacademie.com" },
            update: {},
            create: { email: "admin@lordlomboacademie.com", passwordHash: adminHash, firstName: "Lord", lastName: "Lombo", role: "ADMIN", emailVerified: true, bio: "Pasteur, chanteur, auteur et visionnaire du ministere Lord Lombo Ministries." },
        });
        await this.prisma.user.upsert({
            where: { email: "jean@demo.com" },
            update: {},
            create: { email: "jean@demo.com", passwordHash: studentHash, firstName: "Jean", lastName: "Kisula", role: "STUDENT", emailVerified: true },
        });
        await this.prisma.user.upsert({
            where: { email: "pasteur.mukendi@llacademie.com" },
            update: {},
            create: { email: "pasteur.mukendi@llacademie.com", passwordHash: instructorHash, firstName: "Pasteur", lastName: "Mukendi", role: "INSTRUCTOR", emailVerified: true, bio: "Pasteur et enseignant avec plus de 15 ans d'experience." },
        });
        await this.prisma.user.upsert({
            where: { email: "sarah.mbuyi@llacademie.com" },
            update: {},
            create: { email: "sarah.mbuyi@llacademie.com", passwordHash: instructorHash, firstName: "Sarah", lastName: "Mbuyi", role: "INSTRUCTOR", emailVerified: true, bio: "Formatrice en leadership et communication." },
        });
        await this.prisma.user.upsert({
            where: { email: "moderateur@lordlomboacademie.com" },
            update: {},
            create: { email: "moderateur@lordlomboacademie.com", passwordHash: modHash, firstName: "Grace", lastName: "Kabongo", role: "MODERATOR", emailVerified: true },
        });
        await this.prisma.user.upsert({
            where: { email: "superadmin@lordlomboacademie.com" },
            update: {},
            create: { email: "superadmin@lordlomboacademie.com", passwordHash: superHash, firstName: "Urbain", lastName: "Ahoadi", role: "SUPER_ADMIN", emailVerified: true },
        });
        return { message: "Seed completed - 6 users created/updated" };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "check", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("seed"),
    __param(0, (0, common_1.Query)("secret")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "seed", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)("health"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HealthController);
//# sourceMappingURL=health.controller.js.map