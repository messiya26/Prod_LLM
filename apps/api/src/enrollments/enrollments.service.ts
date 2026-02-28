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

    return this.prisma.enrollment.create({
      data: { userId, courseId },
      include: { course: { select: { id: true, title: true, slug: true } } },
    });
  }

  async getMyEnrollments(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: true,
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
    return { enrolled: !!enrollment };
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
}
