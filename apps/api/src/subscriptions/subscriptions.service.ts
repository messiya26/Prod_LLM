import { Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

const PLAN_PRICES: Record<string, { monthly: number; annual: number }> = {
  FREE: { monthly: 0, annual: 0 },
  ESSENTIAL: { monthly: 29, annual: 24 },
  PREMIUM: { monthly: 79, annual: 65 },
};

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async subscribe(userId: string, plan: string, interval = "monthly") {
    const existing = await this.prisma.subscription.findFirst({
      where: { userId, status: "ACTIVE" },
    });
    if (existing && existing.plan === plan) {
      throw new ConflictException("Vous avez deja cet abonnement actif");
    }

    if (existing) {
      await this.prisma.subscription.update({
        where: { id: existing.id },
        data: { status: "CANCELLED", cancelledAt: new Date() },
      });
    }

    const prices = PLAN_PRICES[plan] || PLAN_PRICES.FREE;
    const amount = interval === "annual" ? prices.annual * 12 : prices.monthly;
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (interval === "annual" ? 12 : 1));

    return this.prisma.subscription.create({
      data: {
        userId,
        plan: plan as any,
        status: "ACTIVE",
        amount,
        interval,
        endDate: plan === "FREE" ? null : endDate,
      },
    });
  }

  async cancel(userId: string) {
    const sub = await this.prisma.subscription.findFirst({
      where: { userId, status: "ACTIVE" },
    });
    if (!sub) return { message: "Aucun abonnement actif" };

    return this.prisma.subscription.update({
      where: { id: sub.id },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    });
  }

  async getCurrent(userId: string) {
    const sub = await this.prisma.subscription.findFirst({
      where: { userId, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });
    return sub || { plan: "FREE", status: "ACTIVE", amount: 0, interval: "monthly" };
  }

  findAll() {
    return this.prisma.subscription.findMany({
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  stats() {
    return this.prisma.subscription.groupBy({
      by: ["plan"],
      where: { status: "ACTIVE" },
      _count: true,
    });
  }
}
