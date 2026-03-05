import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(params: {
    userId?: string;
    action: string;
    targetId?: string;
    targetType?: string;
    metadata?: any;
    ip?: string;
    userAgent?: string;
    severity?: string;
  }) {
    try {
      return await this.prisma.auditLog.create({
        data: {
          userId: params.userId || null,
          action: params.action as any,
          targetId: params.targetId,
          targetType: params.targetType,
          metadata: params.metadata || {},
          ip: params.ip,
          userAgent: params.userAgent,
          severity: params.severity || "INFO",
        },
      });
    } catch (e: any) {
      console.error("[AuditLog] Failed to log:", e.message);
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    from?: string;
    to?: string;
    severity?: string;
  }) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 50, 200);
    const where: any = {};

    if (query.userId) where.userId = query.userId;
    if (query.action) where.action = query.action;
    if (query.severity) where.severity = query.severity;
    if (query.from || query.to) {
      where.createdAt = {};
      if (query.from) where.createdAt.gte = new Date(query.from);
      if (query.to) where.createdAt.lte = new Date(query.to);
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true, role: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 86400000);

    const [totalLogs, todayLogs, failedLogins, recentActions] = await Promise.all([
      this.prisma.auditLog.count(),
      this.prisma.auditLog.count({ where: { createdAt: { gte: today } } }),
      this.prisma.auditLog.count({ where: { action: "LOGIN_FAILED", createdAt: { gte: weekAgo } } }),
      this.prisma.auditLog.groupBy({
        by: ["action"],
        _count: { id: true },
        where: { createdAt: { gte: weekAgo } },
        orderBy: { _count: { id: "desc" } },
        take: 10,
      }),
    ]);

    return { totalLogs, todayLogs, failedLogins, recentActions };
  }
}
