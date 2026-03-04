import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MailService } from "../mail/mail.service";

@Injectable()
export class MasterclassesService {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  async findAll(onlyPublished = false) {
    const where = onlyPublished ? { status: { in: ["PUBLISHED", "ONGOING"] as any } } : {};
    return this.prisma.masterclass.findMany({
      where,
      include: {
        instructor: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        _count: { select: { registrations: true } },
      },
      orderBy: { startDate: "asc" },
    });
  }

  async findBySlug(slug: string) {
    const mc = await this.prisma.masterclass.findUnique({
      where: { slug },
      include: {
        instructor: { select: { id: true, firstName: true, lastName: true, avatar: true, bio: true } },
        registrations: {
          include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
          orderBy: { registeredAt: "desc" },
          take: 10,
        },
        _count: { select: { registrations: true } },
      },
    });
    if (!mc) throw new NotFoundException("Masterclass introuvable");
    return mc;
  }

  async findById(id: string) {
    return this.prisma.masterclass.findUnique({
      where: { id },
      include: {
        instructor: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        _count: { select: { registrations: true } },
      },
    });
  }

  async create(dto: any) {
    const slug = dto.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);

    return this.prisma.masterclass.create({
      data: {
        title: dto.title,
        titleEn: dto.titleEn || "",
        slug,
        description: dto.description || "",
        descriptionEn: dto.descriptionEn || "",
        shortDesc: dto.shortDesc || "",
        shortDescEn: dto.shortDescEn || "",
        thumbnail: dto.thumbnail || "",
        bannerImage: dto.bannerImage || "",
        category: dto.category || "general",
        level: dto.level || "all",
        format: dto.format || "ONLINE",
        status: dto.status || "DRAFT",
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        dailyStartTime: dto.dailyStartTime || "09:00",
        dailyEndTime: dto.dailyEndTime || "17:00",
        timezone: dto.timezone || "Africa/Kinshasa",
        location: dto.location || "",
        meetingLink: dto.meetingLink || "",
        price: parseFloat(dto.price) || 0,
        currency: dto.currency || "USD",
        earlyBirdPrice: dto.earlyBirdPrice ? parseFloat(dto.earlyBirdPrice) : null,
        earlyBirdEnd: dto.earlyBirdEnd ? new Date(dto.earlyBirdEnd) : null,
        maxSeats: parseInt(dto.maxSeats) || 50,
        seatsLeft: parseInt(dto.maxSeats) || 50,
        instructorId: dto.instructorId || null,
        programFr: typeof dto.programFr === "string" ? dto.programFr : JSON.stringify(dto.programFr || []),
        programEn: typeof dto.programEn === "string" ? dto.programEn : JSON.stringify(dto.programEn || []),
        whatYouLearnFr: typeof dto.whatYouLearnFr === "string" ? dto.whatYouLearnFr : JSON.stringify(dto.whatYouLearnFr || []),
        whatYouLearnEn: typeof dto.whatYouLearnEn === "string" ? dto.whatYouLearnEn : JSON.stringify(dto.whatYouLearnEn || []),
        prerequisites: typeof dto.prerequisites === "string" ? dto.prerequisites : JSON.stringify(dto.prerequisites || []),
        includedFr: typeof dto.includedFr === "string" ? dto.includedFr : JSON.stringify(dto.includedFr || []),
        includedEn: typeof dto.includedEn === "string" ? dto.includedEn : JSON.stringify(dto.includedEn || []),
        isFeatured: dto.isFeatured || false,
        certificateIncluded: dto.certificateIncluded !== false,
        replayAvailable: dto.replayAvailable !== false,
      },
    });
  }

  async update(id: string, dto: any) {
    const data: any = {};
    const fields = [
      "title", "titleEn", "description", "descriptionEn", "shortDesc", "shortDescEn",
      "thumbnail", "bannerImage", "category", "level", "format", "status",
      "dailyStartTime", "dailyEndTime", "timezone", "location", "meetingLink",
      "currency", "isFeatured", "certificateIncluded", "replayAvailable",
    ];
    fields.forEach(f => { if (dto[f] !== undefined) data[f] = dto[f]; });
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    if (dto.price !== undefined) data.price = parseFloat(dto.price);
    if (dto.earlyBirdPrice !== undefined) data.earlyBirdPrice = dto.earlyBirdPrice ? parseFloat(dto.earlyBirdPrice) : null;
    if (dto.earlyBirdEnd !== undefined) data.earlyBirdEnd = dto.earlyBirdEnd ? new Date(dto.earlyBirdEnd) : null;
    if (dto.maxSeats !== undefined) {
      const current = await this.prisma.masterclass.findUnique({ where: { id } });
      const diff = parseInt(dto.maxSeats) - (current?.maxSeats || 0);
      data.maxSeats = parseInt(dto.maxSeats);
      data.seatsLeft = Math.max(0, (current?.seatsLeft || 0) + diff);
    }
    if (dto.instructorId !== undefined) data.instructorId = dto.instructorId || null;
    const jsonFields = ["programFr", "programEn", "whatYouLearnFr", "whatYouLearnEn", "prerequisites", "includedFr", "includedEn", "testimonials"];
    jsonFields.forEach(f => {
      if (dto[f] !== undefined) data[f] = typeof dto[f] === "string" ? dto[f] : JSON.stringify(dto[f]);
    });
    return this.prisma.masterclass.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.masterclass.delete({ where: { id } });
  }

  async register(masterclassId: string, userId: string) {
    const mc = await this.prisma.masterclass.findUnique({ where: { id: masterclassId } });
    if (!mc) throw new NotFoundException("Masterclass introuvable");
    if (mc.seatsLeft <= 0) throw new ConflictException("Plus de places disponibles");

    const existing = await this.prisma.masterclassRegistration.findUnique({
      where: { masterclassId_userId: { masterclassId, userId } },
    });
    if (existing) throw new ConflictException("Vous etes deja inscrit a cette masterclass");

    const isEarlyBird = mc.earlyBirdPrice && mc.earlyBirdEnd && new Date() < mc.earlyBirdEnd;
    const amount = isEarlyBird ? mc.earlyBirdPrice! : mc.price;

    const [reg] = await this.prisma.$transaction([
      this.prisma.masterclassRegistration.create({
        data: {
          masterclassId,
          userId,
          status: mc.price === 0 ? "CONFIRMED" : "PENDING",
          amountPaid: mc.price === 0 ? 0 : amount,
        },
      }),
      this.prisma.masterclass.update({
        where: { id: masterclassId },
        data: { seatsLeft: { decrement: 1 } },
      }),
    ]);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.email) {
      this.mail.sendRegistrationConfirmation(user.email, {
        userName: `${user.firstName} ${user.lastName}`,
        eventTitle: mc.title,
        eventDate: new Date(mc.startDate).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
        eventTime: `${mc.dailyStartTime || "09:00"} - ${mc.dailyEndTime || "17:00"}`,
        eventLocation: mc.location || mc.format === "ONLINE" ? "En ligne" : "A confirmer",
        type: "masterclass",
      }).catch(() => {});
    }

    return reg;
  }

  async confirmPayment(registrationId: string, paymentRef: string) {
    return this.prisma.masterclassRegistration.update({
      where: { id: registrationId },
      data: { status: "CONFIRMED", paymentRef },
    });
  }

  async getRegistrations(masterclassId: string) {
    return this.prisma.masterclassRegistration.findMany({
      where: { masterclassId },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } } },
      orderBy: { registeredAt: "desc" },
    });
  }

  async checkRegistration(masterclassId: string, userId: string) {
    return this.prisma.masterclassRegistration.findUnique({
      where: { masterclassId_userId: { masterclassId, userId } },
    });
  }

  async stats() {
    const [total, published, upcoming, totalRegs] = await Promise.all([
      this.prisma.masterclass.count(),
      this.prisma.masterclass.count({ where: { status: "PUBLISHED" } }),
      this.prisma.masterclass.count({ where: { startDate: { gt: new Date() }, status: "PUBLISHED" } }),
      this.prisma.masterclassRegistration.count(),
    ]);
    return { total, published, upcoming, totalRegistrations: totalRegs };
  }
}
