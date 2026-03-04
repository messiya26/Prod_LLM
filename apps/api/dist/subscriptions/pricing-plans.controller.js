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
exports.PricingPlansController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/guards/roles.decorator");
let PricingPlansController = class PricingPlansController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.pricingPlan.findMany({
            where: { active: true },
            orderBy: { sortOrder: "asc" },
        });
    }
    findAllAdmin() {
        return this.prisma.pricingPlan.findMany({ orderBy: { sortOrder: "asc" } });
    }
    create(dto) {
        return this.prisma.pricingPlan.create({
            data: {
                slug: dto.slug,
                nameFr: dto.nameFr,
                nameEn: dto.nameEn,
                descFr: dto.descFr || "",
                descEn: dto.descEn || "",
                monthlyPrice: dto.monthlyPrice || 0,
                annualPrice: dto.annualPrice || 0,
                currency: dto.currency || "USD",
                featuresFr: JSON.stringify(dto.featuresFr || []),
                featuresEn: JSON.stringify(dto.featuresEn || []),
                popular: dto.popular || false,
                isFree: dto.isFree || false,
                sortOrder: dto.sortOrder || 0,
                active: dto.active !== false,
                ctaFr: dto.ctaFr || "Choisir",
                ctaEn: dto.ctaEn || "Choose",
            },
        });
    }
    async update(id, dto) {
        const data = {};
        if (dto.nameFr !== undefined)
            data.nameFr = dto.nameFr;
        if (dto.nameEn !== undefined)
            data.nameEn = dto.nameEn;
        if (dto.descFr !== undefined)
            data.descFr = dto.descFr;
        if (dto.descEn !== undefined)
            data.descEn = dto.descEn;
        if (dto.monthlyPrice !== undefined)
            data.monthlyPrice = dto.monthlyPrice;
        if (dto.annualPrice !== undefined)
            data.annualPrice = dto.annualPrice;
        if (dto.currency !== undefined)
            data.currency = dto.currency;
        if (dto.featuresFr !== undefined)
            data.featuresFr = JSON.stringify(dto.featuresFr);
        if (dto.featuresEn !== undefined)
            data.featuresEn = JSON.stringify(dto.featuresEn);
        if (dto.popular !== undefined)
            data.popular = dto.popular;
        if (dto.isFree !== undefined)
            data.isFree = dto.isFree;
        if (dto.sortOrder !== undefined)
            data.sortOrder = dto.sortOrder;
        if (dto.active !== undefined)
            data.active = dto.active;
        if (dto.ctaFr !== undefined)
            data.ctaFr = dto.ctaFr;
        if (dto.ctaEn !== undefined)
            data.ctaEn = dto.ctaEn;
        if (dto.slug !== undefined)
            data.slug = dto.slug;
        return this.prisma.pricingPlan.update({ where: { id }, data });
    }
    remove(id) {
        return this.prisma.pricingPlan.delete({ where: { id } });
    }
};
exports.PricingPlansController = PricingPlansController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PricingPlansController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("admin"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PricingPlansController.prototype, "findAllAdmin", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PricingPlansController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PricingPlansController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PricingPlansController.prototype, "remove", null);
exports.PricingPlansController = PricingPlansController = __decorate([
    (0, common_1.Controller)("pricing-plans"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PricingPlansController);
//# sourceMappingURL=pricing-plans.controller.js.map