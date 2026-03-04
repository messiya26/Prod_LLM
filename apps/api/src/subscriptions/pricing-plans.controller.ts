import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/guards/roles.decorator";

@Controller("pricing-plans")
export class PricingPlansController {
  constructor(private prisma: PrismaService) {}

  @Get()
  findAll() {
    return this.prisma.pricingPlan.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
  }

  @Get("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  findAllAdmin() {
    return this.prisma.pricingPlan.findMany({ orderBy: { sortOrder: "asc" } });
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  create(@Body() dto: any) {
    return this.prisma.pricingPlan.create({
      data: {
        slug: dto.slug,
        nameFr: dto.nameFr,
        nameEn: dto.nameEn,
        descFr: dto.descFr || "",
        descEn: dto.descEn || "",
        monthlyPrice: dto.monthlyPrice || 0,
        annualPrice: dto.annualPrice || 0,
        currency: dto.currency || "USD",
        featuresFr: JSON.stringify(dto.featuresFr || []),
        featuresEn: JSON.stringify(dto.featuresEn || []),
        popular: dto.popular || false,
        isFree: dto.isFree || false,
        sortOrder: dto.sortOrder || 0,
        active: dto.active !== false,
        ctaFr: dto.ctaFr || "Choisir",
        ctaEn: dto.ctaEn || "Choose",
      },
    });
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async update(@Param("id") id: string, @Body() dto: any) {
    const data: any = {};
    if (dto.nameFr !== undefined) data.nameFr = dto.nameFr;
    if (dto.nameEn !== undefined) data.nameEn = dto.nameEn;
    if (dto.descFr !== undefined) data.descFr = dto.descFr;
    if (dto.descEn !== undefined) data.descEn = dto.descEn;
    if (dto.monthlyPrice !== undefined) data.monthlyPrice = dto.monthlyPrice;
    if (dto.annualPrice !== undefined) data.annualPrice = dto.annualPrice;
    if (dto.currency !== undefined) data.currency = dto.currency;
    if (dto.featuresFr !== undefined) data.featuresFr = JSON.stringify(dto.featuresFr);
    if (dto.featuresEn !== undefined) data.featuresEn = JSON.stringify(dto.featuresEn);
    if (dto.popular !== undefined) data.popular = dto.popular;
    if (dto.isFree !== undefined) data.isFree = dto.isFree;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;
    if (dto.active !== undefined) data.active = dto.active;
    if (dto.ctaFr !== undefined) data.ctaFr = dto.ctaFr;
    if (dto.ctaEn !== undefined) data.ctaEn = dto.ctaEn;
    if (dto.slug !== undefined) data.slug = dto.slug;
    return this.prisma.pricingPlan.update({ where: { id }, data });
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  remove(@Param("id") id: string) {
    return this.prisma.pricingPlan.delete({ where: { id } });
  }
}
