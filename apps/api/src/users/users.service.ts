import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma";
import { MailService } from "../mail/mail.service";
import * as crypto from "crypto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  findAll(page = 1, limit = 20) {
    return this.prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true, role: true, createdAt: true, enrollments: { include: { course: { select: { id: true, title: true, slug: true, thumbnail: true } } } } },
    });
  }

  async count() {
    return this.prisma.user.count();
  }

  async updateRole(userId: string, role: string) {
    const validRoles = ["STUDENT", "INSTRUCTOR", "MODERATOR", "ADMIN", "SUPER_ADMIN"];
    if (!validRoles.includes(role)) throw new BadRequestException("Role invalide");
    return this.prisma.user.update({ where: { id: userId }, data: { role: role as any } });
  }

  async inviteAdmin(email: string, role: "INSTRUCTOR" | "ADMIN", inviterId: string) {
    const inviter = await this.prisma.user.findUnique({ where: { id: inviterId } });
    if (!inviter || !["ADMIN", "SUPER_ADMIN"].includes(inviter.role)) throw new BadRequestException("Non autorise");

    const existing = await this.prisma.adminInvitation.findFirst({
      where: { email, accepted: false, expiresAt: { gt: new Date() } },
    });
    if (existing) throw new BadRequestException("Une invitation est deja en cours pour cet email");

    const token = crypto.randomBytes(32).toString("hex");
    await this.prisma.adminInvitation.create({
      data: {
        email,
        role,
        token,
        invitedBy: inviterId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const inviterName = `${inviter.firstName} ${inviter.lastName}`;
    this.mail.sendAdminInvitation(email, inviterName, role, token).catch(() => {});

    return { message: "Invitation envoyee" };
  }

  async acceptInvitation(token: string) {
    const invitation = await this.prisma.adminInvitation.findUnique({ where: { token } });
    if (!invitation) throw new BadRequestException("Invitation invalide");
    if (invitation.accepted) throw new BadRequestException("Invitation deja acceptee");
    if (invitation.expiresAt < new Date()) throw new BadRequestException("Invitation expiree");

    const user = await this.prisma.user.findUnique({ where: { email: invitation.email } });
    if (!user) throw new BadRequestException("Creez d'abord un compte avec cet email");

    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: user.id }, data: { role: invitation.role } }),
      this.prisma.adminInvitation.update({ where: { id: invitation.id }, data: { accepted: true } }),
    ]);

    return { message: "Invitation acceptee", role: invitation.role };
  }

  async getInvitations() {
    return this.prisma.adminInvitation.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }
}
