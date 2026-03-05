import { Controller, Get, Post, Query, UnauthorizedException } from "@nestjs/common";
import { Public } from "../auth/guards/public.decorator";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcryptjs";

@Controller("health")
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Public()
  @Get()
  check() {
    return { status: "ok", timestamp: new Date().toISOString(), service: "Lord Lombo Academie API" };
  }

  @Public()
  @Post("seed")
  async seed(@Query("secret") secret: string) {
    if (secret !== "LLM2026SeedNow!") throw new UnauthorizedException("Invalid secret");

    const adminHash = await bcrypt.hash("Admin2026!", 12);
    const studentHash = await bcrypt.hash("Student2026!", 12);
    const instructorHash = await bcrypt.hash("Instructor2026!", 12);
    const modHash = await bcrypt.hash("Moderateur2026!", 12);
    const superHash = await bcrypt.hash("SuperAdmin2026!", 12);

    await this.prisma.user.upsert({
      where: { email: "admin@lordlomboacademie.com" },
      update: {},
      create: { email: "admin@lordlomboacademie.com", passwordHash: adminHash, firstName: "Lord", lastName: "Lombo", role: "ADMIN", emailVerified: true, bio: "Pasteur, chanteur, auteur et visionnaire du ministere Lord Lombo Ministries." },
    });
    await this.prisma.user.upsert({
      where: { email: "jean@demo.com" },
      update: {},
      create: { email: "jean@demo.com", passwordHash: studentHash, firstName: "Jean", lastName: "Kisula", role: "STUDENT", emailVerified: true },
    });
    await this.prisma.user.upsert({
      where: { email: "pasteur.mukendi@llacademie.com" },
      update: {},
      create: { email: "pasteur.mukendi@llacademie.com", passwordHash: instructorHash, firstName: "Pasteur", lastName: "Mukendi", role: "INSTRUCTOR", emailVerified: true, bio: "Pasteur et enseignant avec plus de 15 ans d'experience." },
    });
    await this.prisma.user.upsert({
      where: { email: "sarah.mbuyi@llacademie.com" },
      update: {},
      create: { email: "sarah.mbuyi@llacademie.com", passwordHash: instructorHash, firstName: "Sarah", lastName: "Mbuyi", role: "INSTRUCTOR", emailVerified: true, bio: "Formatrice en leadership et communication." },
    });
    await this.prisma.user.upsert({
      where: { email: "moderateur@lordlomboacademie.com" },
      update: {},
      create: { email: "moderateur@lordlomboacademie.com", passwordHash: modHash, firstName: "Grace", lastName: "Kabongo", role: "MODERATOR", emailVerified: true },
    });
    await this.prisma.user.upsert({
      where: { email: "superadmin@lordlomboacademie.com" },
      update: {},
      create: { email: "superadmin@lordlomboacademie.com", passwordHash: superHash, firstName: "Urbain", lastName: "Ahoadi", role: "SUPER_ADMIN", emailVerified: true },
    });

    return { message: "Seed completed - 6 users created/updated" };
  }
}
