import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from "@nestjs/common";
import { MasterclassesService } from "./masterclasses.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/guards/roles.decorator";

@Controller("masterclasses")
export class MasterclassesController {
  constructor(private service: MasterclassesService) {}

  @Get()
  findPublished() {
    return this.service.findAll(true);
  }

  @Get("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  findAll() {
    return this.service.findAll(false);
  }

  @Get("stats")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  stats() {
    return this.service.stats();
  }

  @Get(":slug")
  findBySlug(@Param("slug") slug: string) {
    return this.service.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  update(@Param("id") id: string, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }

  @Post(":id/register")
  @UseGuards(JwtAuthGuard)
  register(@Param("id") id: string, @Request() req: any) {
    return this.service.register(id, req.user.id || req.user.sub);
  }

  @Get(":id/check-registration")
  @UseGuards(JwtAuthGuard)
  checkRegistration(@Param("id") id: string, @Request() req: any) {
    return this.service.checkRegistration(id, req.user.id || req.user.sub);
  }

  @Get(":id/registrations")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  getRegistrations(@Param("id") id: string) {
    return this.service.getRegistrations(id);
  }

  @Put("registrations/:regId/confirm")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  confirmPayment(@Param("regId") regId: string, @Body() body: { paymentRef: string }) {
    return this.service.confirmPayment(regId, body.paymentRef);
  }
}
