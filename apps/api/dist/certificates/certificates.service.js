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
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_1 = require("crypto");
let CertificatesService = class CertificatesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getByUser(userId) {
        return this.prisma.certificate.findMany({
            where: { userId },
            orderBy: { issuedAt: 'desc' },
        });
    }
    async verify(certificateId) {
        const cert = await this.prisma.certificate.findUnique({ where: { certificateId } });
        if (!cert)
            throw new common_1.NotFoundException('Certificate not found');
        const expectedHash = this.computeHash(cert.certificateId, cert.userId, cert.courseId);
        const valid = expectedHash === cert.verificationHash;
        return { valid, certificate: valid ? cert : null };
    }
    async generate(enrollmentId, userId) {
        const enrollment = await this.prisma.enrollment.findFirst({
            where: { id: enrollmentId, userId },
            include: { course: { include: { instructor: true } } },
        });
        if (!enrollment)
            throw new common_1.NotFoundException('Enrollment not found');
        if (enrollment.status !== 'COMPLETED' && enrollment.progress < 100) {
            throw new common_1.BadRequestException('Course not yet completed');
        }
        const existing = await this.prisma.certificate.findFirst({
            where: { userId, courseId: enrollment.courseId },
        });
        if (existing)
            return existing;
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const certId = `LLA-${new Date().getFullYear()}-${(0, crypto_1.randomBytes)(4).toString('hex').toUpperCase()}`;
        const verificationHash = this.computeHash(certId, userId, enrollment.courseId);
        return this.prisma.certificate.create({
            data: {
                certificateId: certId,
                userId,
                courseId: enrollment.courseId,
                studentName: `${user.firstName} ${user.lastName}`,
                courseName: enrollment.course.title,
                instructorName: enrollment.course.instructor ? `${enrollment.course.instructor.firstName} ${enrollment.course.instructor.lastName}` : null,
                grade: enrollment.progress >= 90 ? 'Distinction' : enrollment.progress >= 80 ? 'Bien' : 'Satisfaisant',
                hoursCompleted: 40,
                verificationHash,
            },
        });
    }
    computeHash(certId, userId, courseId) {
        return (0, crypto_1.createHash)('sha256').update(`${certId}:${userId}:${courseId}:LLA_SECRET_2026`).digest('hex');
    }
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map