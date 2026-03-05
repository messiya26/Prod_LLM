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
exports.GdprService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GdprService = class GdprService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async exportUserData(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                enrollments: { include: { course: { select: { title: true } } } },
                payments: true,
                notifications: { take: 100, orderBy: { createdAt: "desc" } },
                auditLogs: { take: 200, orderBy: { createdAt: "desc" } },
                sessions: { where: { isActive: true } },
                subscriptions: true,
            },
        });
        if (!user)
            return null;
        const { passwordHash, ...safeUser } = user;
        return safeUser;
    }
    async createDeleteRequest(userId) {
        return this.prisma.gdprRequest.create({
            data: { userId, type: "DELETE", status: "PENDING" },
        });
    }
    async createExportRequest(userId) {
        return this.prisma.gdprRequest.create({
            data: { userId, type: "EXPORT", status: "PENDING" },
        });
    }
    async listRequests(query) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const where = {};
        if (query.status)
            where.status = query.status;
        const [data, total] = await Promise.all([
            this.prisma.gdprRequest.findMany({
                where,
                include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.gdprRequest.count({ where }),
        ]);
        return { data, total, page, pages: Math.ceil(total / limit) };
    }
    async processRequest(requestId, processedBy, status) {
        const request = await this.prisma.gdprRequest.update({
            where: { id: requestId },
            data: { status, processedBy, processedAt: new Date() },
        });
        if (status === "APPROVED" && request.type === "DELETE") {
            await this.anonymizeUser(request.userId);
        }
        return request;
    }
    async anonymizeUser(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                email: `deleted_${userId}@anonymized.local`,
                firstName: "Utilisateur",
                lastName: "Supprimé",
                phone: null,
                avatar: null,
                bio: null,
                passwordHash: "DELETED",
            },
        });
    }
};
exports.GdprService = GdprService;
exports.GdprService = GdprService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GdprService);
//# sourceMappingURL=gdpr.service.js.map