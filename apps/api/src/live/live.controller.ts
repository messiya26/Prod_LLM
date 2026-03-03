import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
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

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.svc.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req: any, @Body() dto: CreateLiveSessionDto) {
    return this.svc.create(req.user.id, dto);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  update(@Param("id") id: string, @Body() dto: UpdateLiveSessionDto) {
    return this.svc.update(id, dto);
  }

  @Post(":id/start")
  @UseGuards(JwtAuthGuard)
  start(@Param("id") id: string) {
    return this.svc.start(id);
  }

  @Post(":id/end")
  @UseGuards(JwtAuthGuard)
  end(@Param("id") id: string) {
    return this.svc.end(id);
  }

  @Post(":id/cancel")
  @UseGuards(JwtAuthGuard)
  cancel(@Param("id") id: string) {
    return this.svc.cancel(id);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
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
