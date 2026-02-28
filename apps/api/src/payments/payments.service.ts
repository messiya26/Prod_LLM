import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: { courseId: string; amount: number; method: string }) {
    const ref = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const payment = await this.prisma.payment.create({
      data: {
        userId,
        courseId: dto.courseId,
        amount: dto.amount,
        method: dto.method as any || "STRIPE",
        reference: ref,
        status: dto.amount === 0 ? "COMPLETED" : "PENDING",
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

  async confirm(reference: string) {
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

  findByUser(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      include: { course: { select: { id: true, title: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  stats() {
    return this.prisma.$queryRaw`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'COMPLETED' THEN amount ELSE 0 END) as revenue,
        SUM(CASE WHEN status = 'PENDING' THEN amount ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'REFUNDED' THEN amount ELSE 0 END) as refunded
      FROM payments
    `;
  }
}
