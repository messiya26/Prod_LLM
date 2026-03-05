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
exports.LiveService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const crypto_1 = require("crypto");
let LiveService = class LiveService {
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    generateRoomName(title) {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 30);
        const suffix = (0, crypto_1.randomBytes)(4).toString("hex");
        return `llm-${slug}-${suffix}`;
    }
    async findAll() {
        return this.prisma.liveSession.findMany({
            orderBy: { scheduledAt: "desc" },
            include: { _count: { select: { attendees: true } } },
        });
    }
    async findByHost(hostId) {
        return this.prisma.liveSession.findMany({
            where: { hostId },
            orderBy: { scheduledAt: "desc" },
            include: { _count: { select: { attendees: true } } },
        });
    }
    async findUpcoming() {
        return this.prisma.liveSession.findMany({
            where: { status: { in: ["SCHEDULED", "LIVE"] }, scheduledAt: { gte: new Date() } },
            orderBy: { scheduledAt: "asc" },
            include: { _count: { select: { attendees: true } } },
        });
    }
    async findPast() {
        return this.prisma.liveSession.findMany({
            where: { status: "ENDED" },
            orderBy: { scheduledAt: "desc" },
            include: { _count: { select: { attendees: true } } },
        });
    }
    async findById(id) {
        return this.prisma.liveSession.findUnique({
            where: { id },
            include: { attendees: true, _count: { select: { attendees: true } } },
        });
    }
    async create(hostId, dto) {
        const roomName = this.generateRoomName(dto.title);
        let meetingUrl = dto.meetingUrl;
        if (dto.platform === "JITSI" && !meetingUrl) {
            meetingUrl = `https://meet.jit.si/${roomName}`;
        }
        const session = await this.prisma.liveSession.create({
            data: {
                title: dto.title,
                description: dto.description,
                platform: dto.platform,
                scheduledAt: new Date(dto.scheduledAt),
                courseId: dto.courseId || null,
                maxAttendees: dto.maxAttendees || 100,
                meetingUrl,
                roomName,
                hostId,
            },
        });
        if (dto.courseId) {
            const enrollments = await this.prisma.enrollment.findMany({
                where: { courseId: dto.courseId },
                select: { userId: true },
            });
            const scheduled = new Date(dto.scheduledAt);
            const dateStr = scheduled.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
            await Promise.all(enrollments.map(e => this.notifications.create(e.userId, {
                title: "Nouvelle session live programmee",
                message: `"${dto.title}" est programmee le ${dateStr}. Ne manquez pas !`,
                type: "live",
                link: `/dashboard/live`,
            })));
        }
        return session;
    }
    async update(id, dto) {
        const data = {};
        if (dto.title !== undefined)
            data.title = dto.title;
        if (dto.description !== undefined)
            data.description = dto.description;
        if (dto.platform !== undefined)
            data.platform = dto.platform;
        if (dto.scheduledAt !== undefined)
            data.scheduledAt = new Date(dto.scheduledAt);
        if (dto.courseId !== undefined)
            data.courseId = dto.courseId || null;
        if (dto.maxAttendees !== undefined)
            data.maxAttendees = dto.maxAttendees;
        if (dto.meetingUrl !== undefined)
            data.meetingUrl = dto.meetingUrl;
        if (dto.replayUrl !== undefined)
            data.replayUrl = dto.replayUrl;
        if (dto.status !== undefined)
            data.status = dto.status;
        return this.prisma.liveSession.update({ where: { id }, data });
    }
    async start(id) {
        return this.prisma.liveSession.update({
            where: { id },
            data: { status: "LIVE", startedAt: new Date() },
        });
    }
    async end(id) {
        const session = await this.prisma.liveSession.findUnique({ where: { id } });
        const duration = session?.startedAt ? Math.round((Date.now() - session.startedAt.getTime()) / 60000) : 0;
        return this.prisma.liveSession.update({
            where: { id },
            data: { status: "ENDED", endedAt: new Date(), duration },
        });
    }
    async cancel(id) {
        return this.prisma.liveSession.update({
            where: { id },
            data: { status: "CANCELLED" },
        });
    }
    async delete(id) {
        return this.prisma.liveSession.delete({ where: { id } });
    }
    async join(userId, sessionId) {
        return this.prisma.liveAttendee.upsert({
            where: { userId_sessionId: { userId, sessionId } },
            create: { userId, sessionId },
            update: { joinedAt: new Date(), leftAt: null },
        });
    }
    async leave(userId, sessionId) {
        return this.prisma.liveAttendee.update({
            where: { userId_sessionId: { userId, sessionId } },
            data: { leftAt: new Date() },
        });
    }
};
exports.LiveService = LiveService;
exports.LiveService = LiveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, notifications_service_1.NotificationsService])
], LiveService);
//# sourceMappingURL=live.service.js.map