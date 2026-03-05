import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { userId: string; token: string; ip?: string; userAgent?: string; expiresAt: Date }) {
    const device = this.parseDevice(data.userAgent || "");
    return this.prisma.userSession.create({
      data: { ...data, device },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.userSession.findMany({
      where: { userId, isActive: true },
      orderBy: { lastActive: "desc" },
    });
  }

  async revoke(sessionId: string, userId: string) {
    return this.prisma.userSession.updateMany({
      where: { id: sessionId, userId },
      data: { isActive: false },
    });
  }

  async revokeAll(userId: string, exceptSessionId?: string) {
    const where: any = { userId, isActive: true };
    if (exceptSessionId) where.id = { not: exceptSessionId };
    return this.prisma.userSession.updateMany({ where, data: { isActive: false } });
  }

  async touch(token: string) {
    return this.prisma.userSession.updateMany({
      where: { token, isActive: true },
      data: { lastActive: new Date() },
    });
  }

  async cleanup() {
    return this.prisma.userSession.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { isActive: false, lastActive: { lt: new Date(Date.now() - 30 * 86400000) } },
        ],
      },
    });
  }

  private parseDevice(ua: string): string {
    if (/mobile|android|iphone/i.test(ua)) return "Mobile";
    if (/tablet|ipad/i.test(ua)) return "Tablette";
    return "Ordinateur";
  }
}
