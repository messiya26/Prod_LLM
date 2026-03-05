import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class GdprService {
  constructor(private prisma: PrismaService) {}

  async exportUserData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: { include: { course: { select: { title: true } } } },
        payments: true,
        notifications: { take: 100, orderBy: { createdAt: "desc" } },
        auditLogs: { take: 200, orderBy: { createdAt: "desc" } },
        sessions: { where: { isActive: true } },
        subscriptions: true,
      },
    });

    if (!user) return null;

    const { passwordHash, ...safeUser } = user as any;
    return safeUser;
  }

  async createDeleteRequest(userId: string) {
    return this.prisma.gdprRequest.create({
      data: { userId, type: "DELETE", status: "PENDING" },
    });
  }

  async createExportRequest(userId: string) {
    return this.prisma.gdprRequest.create({
      data: { userId, type: "EXPORT", status: "PENDING" },
    });
  }

  async listRequests(query: { page?: number; limit?: number; status?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const where: any = {};
    if (query.status) where.status = query.status;

    const [data, total] = await Promise.all([
      this.prisma.gdprRequest.findMany({
        where,
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.gdprRequest.count({ where }),
    ]);

    return { data, total, page, pages: Math.ceil(total / limit) };
  }

  async processRequest(requestId: string, processedBy: string, status: "APPROVED" | "REJECTED") {
    const request = await this.prisma.gdprRequest.update({
      where: { id: requestId },
      data: { status, processedBy, processedAt: new Date() },
    });

    if (status === "APPROVED" && request.type === "DELETE") {
      await this.anonymizeUser(request.userId);
    }

    return request;
  }

  private async anonymizeUser(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: `deleted_${userId}@anonymized.local`,
        firstName: "Utilisateur",
        lastName: "Supprimé",
        phone: null,
        avatar: null,
        bio: null,
        passwordHash: "DELETED",
      },
    });
  }
}
