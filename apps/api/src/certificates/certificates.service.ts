import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async getByUser(userId: string) {
    return this.prisma.certificate.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async verify(certificateId: string) {
    const cert = await this.prisma.certificate.findUnique({ where: { certificateId } });
    if (!cert) throw new NotFoundException('Certificate not found');
    const expectedHash = this.computeHash(cert.certificateId, cert.userId, cert.courseId);
    const valid = expectedHash === cert.verificationHash;
    return { valid, certificate: valid ? cert : null };
  }

  async generate(enrollmentId: string, userId: string) {
    const enrollment = await this.prisma.enrollment.findFirst({
      where: { id: enrollmentId, userId },
      include: { course: { include: { instructor: true } } },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    if (enrollment.status !== 'COMPLETED' && enrollment.progress < 100) {
      throw new BadRequestException('Course not yet completed');
    }

    const existing = await this.prisma.certificate.findFirst({
      where: { userId, courseId: enrollment.courseId },
    });
    if (existing) return existing;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const certId = `LLA-${new Date().getFullYear()}-${randomBytes(4).toString('hex').toUpperCase()}`;
    const verificationHash = this.computeHash(certId, userId, enrollment.courseId);

    return this.prisma.certificate.create({
      data: {
        certificateId: certId,
        userId,
        courseId: enrollment.courseId,
        studentName: `${user!.firstName} ${user!.lastName}`,
        courseName: enrollment.course.title,
        instructorName: enrollment.course.instructor ? `${enrollment.course.instructor.firstName} ${enrollment.course.instructor.lastName}` : null,
        grade: enrollment.progress >= 90 ? 'Distinction' : enrollment.progress >= 80 ? 'Bien' : 'Satisfaisant',
        hoursCompleted: 40,
        verificationHash,
      },
    });
  }

  private computeHash(certId: string, userId: string, courseId: string): string {
    return createHash('sha256').update(`${certId}:${userId}:${courseId}:LLA_SECRET_2026`).digest('hex');
  }
}
