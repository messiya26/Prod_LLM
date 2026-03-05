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
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SessionsService = class SessionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const device = this.parseDevice(data.userAgent || "");
        return this.prisma.userSession.create({
            data: { ...data, device },
        });
    }
    async findByUser(userId) {
        return this.prisma.userSession.findMany({
            where: { userId, isActive: true },
            orderBy: { lastActive: "desc" },
        });
    }
    async revoke(sessionId, userId) {
        return this.prisma.userSession.updateMany({
            where: { id: sessionId, userId },
            data: { isActive: false },
        });
    }
    async revokeAll(userId, exceptSessionId) {
        const where = { userId, isActive: true };
        if (exceptSessionId)
            where.id = { not: exceptSessionId };
        return this.prisma.userSession.updateMany({ where, data: { isActive: false } });
    }
    async touch(token) {
        return this.prisma.userSession.updateMany({
            where: { token, isActive: true },
            data: { lastActive: new Date() },
        });
    }
    async cleanup() {
        return this.prisma.userSession.deleteMany({
            where: {
                OR: [
                    { expiresAt: { lt: new Date() } },
                    { isActive: false, lastActive: { lt: new Date(Date.now() - 30 * 86400000) } },
                ],
            },
        });
    }
    parseDevice(ua) {
        if (/mobile|android|iphone/i.test(ua))
            return "Mobile";
        if (/tablet|ipad/i.test(ua))
            return "Tablette";
        return "Ordinateur";
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map