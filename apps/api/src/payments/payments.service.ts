import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MailService } from "../mail/mail.service";

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  private mapMethod(method: string): string {
    const map: Record<string, string> = {
      card: "STRIPE", stripe: "STRIPE",
      paypal: "PAYPAL",
      mobile_money: "MOBILE_MONEY", mobilemoney: "MOBILE_MONEY", "mobile-money": "MOBILE_MONEY",
      mpesa: "MPESA", "m-pesa": "MPESA",
      illicocash: "ILLICOCASH",
      cashapp: "CASH_APP", "cash-app": "CASH_APP", cash_app: "CASH_APP",
      bank: "BANK_TRANSFER", virement: "BANK_TRANSFER", bank_transfer: "BANK_TRANSFER",
      free: "FREE",
    };
    return map[method?.toLowerCase()] || "STRIPE";
  }

  async create(userId: string, dto: { courseId: string; amount: number; method: string; metadata?: string }) {
    const ref = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const mappedMethod = this.mapMethod(dto.method);
    const payment = await this.prisma.payment.create({
      data: {
        userId,
        courseId: dto.courseId,
        amount: dto.amount,
        method: mappedMethod as any,
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

  async confirm(reference: string) {
    const payment = await this.prisma.payment.update({
      where: { reference },
      data: { status: "COMPLETED" },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        course: { select: { title: true } },
      },
    });
    await this.prisma.enrollment.upsert({
      where: { userId_courseId: { userId: payment.userId, courseId: payment.courseId } },
      update: { status: "ACTIVE" },
      create: { userId: payment.userId, courseId: payment.courseId, status: "ACTIVE" },
    });
    if (payment.user?.email) {
      this.mail.sendPaymentConfirmation(payment.user.email, {
        userName: `${payment.user.firstName || ""} ${payment.user.lastName || ""}`.trim(),
        courseTitle: payment.course?.title || "Formation",
        amount: Number(payment.amount),
        currency: "USD",
        reference: payment.reference,
        method: payment.method,
      }).catch(() => {});
    }
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
      include: {
        course: { select: { id: true, title: true } },
        user: { select: { firstName: true, lastName: true, email: true } },
      },
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

  async instructorStats(instructorId: string) {
    const courses = await this.prisma.course.findMany({
      where: { instructorId },
      select: { id: true, title: true },
    });
    const courseIds = courses.map(c => c.id);
    if (!courseIds.length) return { totalRevenue: 0, totalStudents: 0, payments: [], courses: [] };

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

  async instructorStudents(instructorId: string) {
    const courses = await this.prisma.course.findMany({
      where: { instructorId },
      select: { id: true },
    });
    const courseIds = courses.map(c => c.id);
    if (!courseIds.length) return [];

    return this.prisma.enrollment.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        course: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
