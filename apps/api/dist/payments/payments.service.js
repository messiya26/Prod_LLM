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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const ref = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        const payment = await this.prisma.payment.create({
            data: {
                userId,
                courseId: dto.courseId,
                amount: dto.amount,
                method: dto.method || "STRIPE",
                reference: ref,
                status: dto.amount === 0 ? "COMPLETED" : "PENDING",
                metadata: dto.metadata || null,
            },
            include: { course: true, user: { select: { id: true, firstName: true, lastName: true, email: true } } },
        });
        if (dto.amount === 0) {
            await this.prisma.enrollment.upsert({
                where: { userId_courseId: { userId, courseId: dto.courseId } },
                update: { status: "ACTIVE" },
                create: { userId, courseId: dto.courseId, status: "ACTIVE" },
            });
        }
        return payment;
    }
    async confirm(reference) {
        const payment = await this.prisma.payment.update({
            where: { reference },
            data: { status: "COMPLETED" },
        });
        await this.prisma.enrollment.upsert({
            where: { userId_courseId: { userId: payment.userId, courseId: payment.courseId } },
            update: { status: "ACTIVE" },
            create: { userId: payment.userId, courseId: payment.courseId, status: "ACTIVE" },
        });
        return payment;
    }
    findAll() {
        return this.prisma.payment.findMany({
            include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true } },
                course: { select: { id: true, title: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    findByUser(userId) {
        return this.prisma.payment.findMany({
            where: { userId },
            include: { course: { select: { id: true, title: true } } },
            orderBy: { createdAt: "desc" },
        });
    }
    stats() {
        return this.prisma.$queryRaw `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'COMPLETED' THEN amount ELSE 0 END) as revenue,
        SUM(CASE WHEN status = 'PENDING' THEN amount ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'REFUNDED' THEN amount ELSE 0 END) as refunded
      FROM payments
    `;
    }
    async instructorStats(instructorId) {
        const courses = await this.prisma.course.findMany({
            where: { instructorId },
            select: { id: true, title: true },
        });
        const courseIds = courses.map(c => c.id);
        if (!courseIds.length)
            return { totalRevenue: 0, totalStudents: 0, payments: [], courses: [] };
        const payments = await this.prisma.payment.findMany({
            where: { courseId: { in: courseIds }, status: "COMPLETED" },
            include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true } },
                course: { select: { id: true, title: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        const totalRevenue = payments.reduce((s, p) => s + Number(p.amount), 0);
        const uniqueStudents = new Set(payments.map(p => p.userId));
        return {
            totalRevenue,
            totalStudents: uniqueStudents.size,
            payments: payments.slice(0, 20),
            courses: courses.map(c => ({
                ...c,
                revenue: payments.filter(p => p.courseId === c.id).reduce((s, p) => s + Number(p.amount), 0),
                students: new Set(payments.filter(p => p.courseId === c.id).map(p => p.userId)).size,
            })),
        };
    }
    async instructorStudents(instructorId) {
        const courses = await this.prisma.course.findMany({
            where: { instructorId },
            select: { id: true },
        });
        const courseIds = courses.map(c => c.id);
        if (!courseIds.length)
            return [];
        return this.prisma.enrollment.findMany({
            where: { courseId: { in: courseIds } },
            include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
                course: { select: { id: true, title: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map