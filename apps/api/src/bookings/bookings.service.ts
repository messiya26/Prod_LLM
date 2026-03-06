import { Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MailService } from "../mail/mail.service";

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  async create(dto: { name: string; email: string; phone?: string; date: string; slot: string; subject: string; notes?: string; userId?: string }) {
    const start = new Date(dto.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dto.date);
    end.setHours(23, 59, 59, 999);
    const existing = await this.prisma.booking.findFirst({
      where: { date: { gte: start, lte: end }, slot: dto.slot, status: { not: "cancelled" } },
    });
    if (existing) {
      throw new ConflictException("Ce creneau est deja reserve. Veuillez en choisir un autre.");
    }
    const booking = await this.prisma.booking.create({
      data: { ...dto, date: new Date(dto.date) },
    });
    this.mail.sendBookingConfirmation(dto.email, dto.name, dto.date, dto.slot, dto.subject).catch(() => {});
    return booking;
  }

  findAll() {
    return this.prisma.booking.findMany({
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { date: "asc" },
    });
  }

  findByDate(date: string) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return this.prisma.booking.findMany({
      where: { date: { gte: start, lte: end } },
      orderBy: { slot: "asc" },
    });
  }

  getAvailableSlots(date: string) {
    const allSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return this.prisma.booking.findMany({
      where: { date: { gte: start, lte: end }, status: { not: "cancelled" } },
    }).then(booked => {
      const taken = booked.map(b => b.slot);
      return allSlots.filter(s => !taken.includes(s));
    });
  }

  updateStatus(id: string, status: string) {
    return this.prisma.booking.update({ where: { id }, data: { status } });
  }
}
