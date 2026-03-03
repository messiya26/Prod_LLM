import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { EventsService } from "./events.service";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll() { return this.eventsService.findAll(true); }

  @Get("admin")
  @UseGuards(JwtAuthGuard)
  findAllAdmin() { return this.eventsService.findAll(false); }

  @Get(":slug")
  findBySlug(@Param("slug") slug: string) { return this.eventsService.findBySlug(slug); }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: any, @Body() body: any) { return this.eventsService.create(req.user.id, body); }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  update(@Param("id") id: string, @Body() body: any) { return this.eventsService.update(id, body); }

  @Post(":id/register")
  register(@Param("id") id: string) { return this.eventsService.register(id); }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  delete(@Param("id") id: string) { return this.eventsService.delete(id); }
}
