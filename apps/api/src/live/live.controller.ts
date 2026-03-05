import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/guards/roles.decorator";
import { LiveService } from "./live.service";
import { CreateLiveSessionDto, UpdateLiveSessionDto } from "./live.dto";

@Controller("live")
export class LiveController {
  constructor(private readonly svc: LiveService) {}

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get("upcoming")
  findUpcoming() {
    return this.svc.findUpcoming();
  }

  @Get("past")
  findPast() {
    return this.svc.findPast();
  }

  @Get("instructor/my")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("INSTRUCTOR", "ADMIN")
  findMyLive(@Request() req: any) {
    return this.svc.findByHost(req.user.id);
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.svc.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("INSTRUCTOR", "ADMIN")
  create(@Request() req: any, @Body() dto: CreateLiveSessionDto) {
    return this.svc.create(req.user.id, dto);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("INSTRUCTOR", "ADMIN")
  update(@Param("id") id: string, @Body() dto: UpdateLiveSessionDto) {
    return this.svc.update(id, dto);
  }

  @Post(":id/start")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("INSTRUCTOR", "ADMIN")
  start(@Param("id") id: string) {
    return this.svc.start(id);
  }

  @Post(":id/end")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("INSTRUCTOR", "ADMIN")
  end(@Param("id") id: string) {
    return this.svc.end(id);
  }

  @Post(":id/cancel")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("INSTRUCTOR", "ADMIN")
  cancel(@Param("id") id: string) {
    return this.svc.cancel(id);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("INSTRUCTOR", "ADMIN")
  delete(@Param("id") id: string) {
    return this.svc.delete(id);
  }

  @Post(":id/join")
  @UseGuards(JwtAuthGuard)
  join(@Request() req: any, @Param("id") id: string) {
    return this.svc.join(req.user.id, id);
  }

  @Post(":id/leave")
  @UseGuards(JwtAuthGuard)
  leave(@Request() req: any, @Param("id") id: string) {
    return this.svc.leave(req.user.id, id);
  }
}
