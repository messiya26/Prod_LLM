import { Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MailService } from "../mail/mail.service";
import { randomBytes } from "crypto";

@Injectable()
export class InvitationsService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  async invite(invitedById: string, email: string, role: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException("Cet utilisateur existe deja");

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invitation = await this.prisma.invitation.create({
      data: { email, role: role as any, token, invitedById, expiresAt },
      include: { invitedBy: { select: { firstName: true, lastName: true } } },
    });

    const inviterName = `${invitation.invitedBy.firstName} ${invitation.invitedBy.lastName}`;
    try {
      await this.mail.sendAdminInvitation(email, inviterName, role, token);
    } catch {}

    return invitation;
  }

  async findAll() {
    return this.prisma.invitation.findMany({
      orderBy: { createdAt: "desc" },
      include: { invitedBy: { select: { firstName: true, lastName: true } } },
    });
  }

  async findByToken(token: string) {
    return this.prisma.invitation.findUnique({ where: { token } });
  }

  async accept(token: string) {
    const inv = await this.prisma.invitation.findUnique({ where: { token } });
    if (!inv || inv.accepted || inv.expiresAt < new Date()) return null;

    await this.prisma.invitation.update({
      where: { id: inv.id },
      data: { accepted: true },
    });
    return inv;
  }

  async delete(id: string) {
    return this.prisma.invitation.delete({ where: { id } });
  }

  async resend(id: string) {
    const inv = await this.prisma.invitation.findUnique({
      where: { id },
      include: { invitedBy: { select: { firstName: true, lastName: true } } },
    });
    if (!inv) return null;

    const newToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.prisma.invitation.update({ where: { id }, data: { token: newToken, expiresAt } });

    const inviterName = `${inv.invitedBy.firstName} ${inv.invitedBy.lastName}`;
    try {
      await this.mail.sendAdminInvitation(inv.email, inviterName, inv.role, newToken);
    } catch {}
    return { success: true };
  }
}
