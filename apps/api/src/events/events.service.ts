import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(authorId: string, data: { title: string; slug?: string; description: string; image?: string; location?: string; isOnline?: boolean; link?: string; date: string; endDate?: string; price?: number; capacity?: number; published?: boolean }) {
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return this.prisma.event.create({
      data: { ...data, slug, date: new Date(data.date), endDate: data.endDate ? new Date(data.endDate) : undefined, authorId },
      include: { author: { select: { firstName: true, lastName: true } } },
    });
  }

  async findAll(publishedOnly = false) {
    return this.prisma.event.findMany({
      where: publishedOnly ? { published: true } : {},
      orderBy: { date: "asc" },
      include: { author: { select: { firstName: true, lastName: true } } },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.event.findUnique({ where: { slug }, include: { author: { select: { firstName: true, lastName: true } } } });
  }

  async update(id: string, data: any) {
    if (data.date) data.date = new Date(data.date);
    if (data.endDate) data.endDate = new Date(data.endDate);
    return this.prisma.event.update({ where: { id }, data, include: { author: { select: { firstName: true, lastName: true } } } });
  }

  async register(id: string) {
    return this.prisma.event.update({ where: { id }, data: { registrations: { increment: 1 } } });
  }

  async delete(id: string) {
    return this.prisma.event.delete({ where: { id } });
  }
}
