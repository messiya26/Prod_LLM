import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateLiveSessionDto, UpdateLiveSessionDto } from "./live.dto";
import { randomBytes } from "crypto";

@Injectable()
export class LiveService {
  constructor(private prisma: PrismaService) {}

  private generateRoomName(title: string): string {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 30);
    const suffix = randomBytes(4).toString("hex");
    return `llm-${slug}-${suffix}`;
  }

  async findAll() {
    return this.prisma.liveSession.findMany({
      orderBy: { scheduledAt: "desc" },
      include: { _count: { select: { attendees: true } } },
    });
  }

  async findUpcoming() {
    return this.prisma.liveSession.findMany({
      where: { status: { in: ["SCHEDULED", "LIVE"] }, scheduledAt: { gte: new Date() } },
      orderBy: { scheduledAt: "asc" },
      include: { _count: { select: { attendees: true } } },
    });
  }

  async findPast() {
    return this.prisma.liveSession.findMany({
      where: { status: "ENDED" },
      orderBy: { scheduledAt: "desc" },
      include: { _count: { select: { attendees: true } } },
    });
  }

  async findById(id: string) {
    return this.prisma.liveSession.findUnique({
      where: { id },
      include: { attendees: true, _count: { select: { attendees: true } } },
    });
  }

  async create(hostId: string, dto: CreateLiveSessionDto) {
    const roomName = this.generateRoomName(dto.title);
    let meetingUrl = dto.meetingUrl;

    if (dto.platform === "JITSI" && !meetingUrl) {
      meetingUrl = `https://meet.jit.si/${roomName}`;
    }

    return this.prisma.liveSession.create({
      data: {
        title: dto.title,
        description: dto.description,
        platform: dto.platform as any,
        scheduledAt: new Date(dto.scheduledAt),
        courseId: dto.courseId || null,
        maxAttendees: dto.maxAttendees || 100,
        meetingUrl,
        roomName,
        hostId,
      },
    });
  }

  async update(id: string, dto: UpdateLiveSessionDto) {
    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.platform !== undefined) data.platform = dto.platform;
    if (dto.scheduledAt !== undefined) data.scheduledAt = new Date(dto.scheduledAt);
    if (dto.courseId !== undefined) data.courseId = dto.courseId || null;
    if (dto.maxAttendees !== undefined) data.maxAttendees = dto.maxAttendees;
    if (dto.meetingUrl !== undefined) data.meetingUrl = dto.meetingUrl;
    if (dto.replayUrl !== undefined) data.replayUrl = dto.replayUrl;
    if (dto.status !== undefined) data.status = dto.status;

    return this.prisma.liveSession.update({ where: { id }, data });
  }

  async start(id: string) {
    return this.prisma.liveSession.update({
      where: { id },
      data: { status: "LIVE", startedAt: new Date() },
    });
  }

  async end(id: string) {
    const session = await this.prisma.liveSession.findUnique({ where: { id } });
    const duration = session?.startedAt ? Math.round((Date.now() - session.startedAt.getTime()) / 60000) : 0;

    return this.prisma.liveSession.update({
      where: { id },
      data: { status: "ENDED", endedAt: new Date(), duration },
    });
  }

  async cancel(id: string) {
    return this.prisma.liveSession.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
  }

  async delete(id: string) {
    return this.prisma.liveSession.delete({ where: { id } });
  }

  async join(userId: string, sessionId: string) {
    return this.prisma.liveAttendee.upsert({
      where: { userId_sessionId: { userId, sessionId } },
      create: { userId, sessionId },
      update: { joinedAt: new Date(), leftAt: null },
    });
  }

  async leave(userId: string, sessionId: string) {
    return this.prisma.liveAttendee.update({
      where: { userId_sessionId: { userId, sessionId } },
      data: { leftAt: new Date() },
    });
  }
}
