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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const PLAN_PRICES = {
    FREE: { monthly: 0, annual: 0 },
    ESSENTIAL: { monthly: 29, annual: 24 },
    PREMIUM: { monthly: 79, annual: 65 },
};
let SubscriptionsService = class SubscriptionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async subscribe(userId, plan, interval = "monthly") {
        const existing = await this.prisma.subscription.findFirst({
            where: { userId, status: "ACTIVE" },
        });
        if (existing && existing.plan === plan) {
            throw new common_1.ConflictException("Vous avez deja cet abonnement actif");
        }
        if (existing) {
            await this.prisma.subscription.update({
                where: { id: existing.id },
                data: { status: "CANCELLED", cancelledAt: new Date() },
            });
        }
        const prices = PLAN_PRICES[plan] || PLAN_PRICES.FREE;
        const amount = interval === "annual" ? prices.annual * 12 : prices.monthly;
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + (interval === "annual" ? 12 : 1));
        return this.prisma.subscription.create({
            data: {
                userId,
                plan: plan,
                status: "ACTIVE",
                amount,
                interval,
                endDate: plan === "FREE" ? null : endDate,
            },
        });
    }
    async cancel(userId) {
        const sub = await this.prisma.subscription.findFirst({
            where: { userId, status: "ACTIVE" },
        });
        if (!sub)
            return { message: "Aucun abonnement actif" };
        return this.prisma.subscription.update({
            where: { id: sub.id },
            data: { status: "CANCELLED", cancelledAt: new Date() },
        });
    }
    async getCurrent(userId) {
        const sub = await this.prisma.subscription.findFirst({
            where: { userId, status: "ACTIVE" },
            orderBy: { createdAt: "desc" },
        });
        return sub || { plan: "FREE", status: "ACTIVE", amount: 0, interval: "monthly" };
    }
    findAll() {
        return this.prisma.subscription.findMany({
            include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
            orderBy: { createdAt: "desc" },
        });
    }
    stats() {
        return this.prisma.subscription.groupBy({
            by: ["plan"],
            where: { status: "ACTIVE" },
            _count: true,
        });
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map