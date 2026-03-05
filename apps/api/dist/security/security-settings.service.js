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
exports.SecuritySettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SecuritySettingsService = class SecuritySettingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async get() {
        let settings = await this.prisma.securitySettings.findUnique({ where: { id: "default" } });
        if (!settings) {
            settings = await this.prisma.securitySettings.create({ data: { id: "default" } });
        }
        return settings;
    }
    async update(data) {
        return this.prisma.securitySettings.upsert({
            where: { id: "default" },
            update: data,
            create: { id: "default", ...data },
        });
    }
    async validatePassword(password) {
        const settings = await this.get();
        const errors = [];
        if (password.length < settings.passwordMinLength)
            errors.push(`Le mot de passe doit contenir au moins ${settings.passwordMinLength} caractères`);
        if (settings.passwordRequireUpper && !/[A-Z]/.test(password))
            errors.push("Le mot de passe doit contenir au moins une majuscule");
        if (settings.passwordRequireLower && !/[a-z]/.test(password))
            errors.push("Le mot de passe doit contenir au moins une minuscule");
        if (settings.passwordRequireNumber && !/[0-9]/.test(password))
            errors.push("Le mot de passe doit contenir au moins un chiffre");
        if (settings.passwordRequireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password))
            errors.push("Le mot de passe doit contenir au moins un caractère spécial");
        return { valid: errors.length === 0, errors };
    }
};
exports.SecuritySettingsService = SecuritySettingsService;
exports.SecuritySettingsService = SecuritySettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SecuritySettingsService);
//# sourceMappingURL=security-settings.service.js.map