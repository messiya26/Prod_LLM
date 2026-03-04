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
exports.EnrollmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../prisma");
let EnrollmentsService = class EnrollmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async enroll(userId, courseIdOrSlug) {
        let courseId = courseIdOrSlug;
        const course = await this.prisma.course.findFirst({
            where: { OR: [{ id: courseIdOrSlug }, { slug: courseIdOrSlug }] },
        });
        if (!course)
            throw new common_1.NotFoundException("Formation introuvable");
        courseId = course.id;
        const existing = await this.prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId } },
        });
        if (existing)
            throw new common_1.ConflictException("Deja inscrit a cette formation");
        const isFree = parseFloat(String(course.price)) === 0;
        return this.prisma.enrollment.create({
            data: { userId, courseId, status: isFree ? "ACTIVE" : "PENDING" },
            include: { course: { select: { id: true, title: true, slug: true } } },
        });
    }
    async activateAfterPayment(userId, courseIdOrSlug) {
        const course = await this.prisma.course.findFirst({
            where: { OR: [{ id: courseIdOrSlug }, { slug: courseIdOrSlug }] },
        });
        if (!course)
            throw new common_1.NotFoundException("Formation introuvable");
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId: course.id } },
        });
        if (!enrollment)
            throw new common_1.NotFoundException("Inscription introuvable");
        return this.prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { status: "ACTIVE" },
        });
    }
    async getMyEnrollments(userId) {
        return this.prisma.enrollment.findMany({
            where: { userId },
            include: {
                course: {
                    include: { _count: { select: { modules: true } } },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    async checkEnrolled(userId, courseIdOrSlug) {
        const course = await this.prisma.course.findFirst({
            where: { OR: [{ id: courseIdOrSlug }, { slug: courseIdOrSlug }] },
        });
        if (!course)
            return { enrolled: false };
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId: course.id } },
        });
        if (!enrollment)
            return { enrolled: false };
        return {
            enrolled: true,
            id: enrollment.id,
            status: enrollment.status,
            progress: enrollment.progress,
        };
    }
    async updateProgress(userId, courseId, progress) {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId } },
        });
        if (!enrollment)
            throw new common_1.NotFoundException("Inscription introuvable");
        return this.prisma.enrollment.update({
            where: { id: enrollment.id },
            data: {
                progress: Math.min(100, Math.max(0, progress)),
                status: progress >= 100 ? "COMPLETED" : "ACTIVE",
            },
        });
    }
    async getRecentEnrollments() {
        return this.prisma.enrollment.findMany({
            take: 10,
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { firstName: true, lastName: true } },
                course: { select: { title: true } },
            },
        });
    }
};
exports.EnrollmentsService = EnrollmentsService;
exports.EnrollmentsService = EnrollmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], EnrollmentsService);
//# sourceMappingURL=enrollments.service.js.map