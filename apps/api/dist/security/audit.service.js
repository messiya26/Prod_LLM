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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AuditService = class AuditService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(params) {
        try {
            return await this.prisma.auditLog.create({
                data: {
                    userId: params.userId || null,
                    action: params.action,
                    targetId: params.targetId,
                    targetType: params.targetType,
                    metadata: params.metadata || {},
                    ip: params.ip,
                    userAgent: params.userAgent,
                    severity: params.severity || "INFO",
                },
            });
        }
        catch (e) {
            console.error("[AuditLog] Failed to log:", e.message);
        }
    }
    async findAll(query) {
        const page = query.page || 1;
        const limit = Math.min(query.limit || 50, 200);
        const where = {};
        if (query.userId)
            where.userId = query.userId;
        if (query.action)
            where.action = query.action;
        if (query.severity)
            where.severity = query.severity;
        if (query.from || query.to) {
            where.createdAt = {};
            if (query.from)
                where.createdAt.gte = new Date(query.from);
            if (query.to)
                where.createdAt.lte = new Date(query.to);
        }
        const [data, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                include: { user: { select: { id: true, firstName: true, lastName: true, email: true, role: true } } },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.auditLog.count({ where }),
        ]);
        return { data, total, page, limit, pages: Math.ceil(total / limit) };
    }
    async getStats() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 86400000);
        const [totalLogs, todayLogs, failedLogins, recentActions] = await Promise.all([
            this.prisma.auditLog.count(),
            this.prisma.auditLog.count({ where: { createdAt: { gte: today } } }),
            this.prisma.auditLog.count({ where: { action: "LOGIN_FAILED", createdAt: { gte: weekAgo } } }),
            this.prisma.auditLog.groupBy({
                by: ["action"],
                _count: { id: true },
                where: { createdAt: { gte: weekAgo } },
                orderBy: { _count: { id: "desc" } },
                take: 10,
            }),
        ]);
        return { totalLogs, todayLogs, failedLogins, recentActions };
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map