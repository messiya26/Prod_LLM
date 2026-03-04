import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma";

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async enroll(userId: string, courseIdOrSlug: string) {
    let courseId = courseIdOrSlug;
    const course = await this.prisma.course.findFirst({
      where: { OR: [{ id: courseIdOrSlug }, { slug: courseIdOrSlug }] },
    });
    if (!course) throw new NotFoundException("Formation introuvable");
    courseId = course.id;

    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) throw new ConflictException("Deja inscrit a cette formation");

    const isFree = parseFloat(String(course.price)) === 0;
    return this.prisma.enrollment.create({
      data: { userId, courseId, status: isFree ? "ACTIVE" : "PENDING" },
      include: { course: { select: { id: true, title: true, slug: true } } },
    });
  }

  async activateAfterPayment(userId: string, courseIdOrSlug: string) {
    const course = await this.prisma.course.findFirst({
      where: { OR: [{ id: courseIdOrSlug }, { slug: courseIdOrSlug }] },
    });
    if (!course) throw new NotFoundException("Formation introuvable");

    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: course.id } },
    });
    if (!enrollment) throw new NotFoundException("Inscription introuvable");

    return this.prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { status: "ACTIVE" },
    });
  }

  async getMyEnrollments(userId: string) {
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

  async checkEnrolled(userId: string, courseIdOrSlug: string) {
    const course = await this.prisma.course.findFirst({
      where: { OR: [{ id: courseIdOrSlug }, { slug: courseIdOrSlug }] },
    });
    if (!course) return { enrolled: false };
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: course.id } },
    });
    if (!enrollment) return { enrolled: false };
    return {
      enrolled: true,
      id: enrollment.id,
      status: enrollment.status,
      progress: enrollment.progress,
    };
  }

  async updateProgress(userId: string, courseId: string, progress: number) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment) throw new NotFoundException("Inscription introuvable");

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
}
