import { Controller, Get, Post, Delete, Body, UseGuards, Request } from "@nestjs/common";
import { SubscriptionsService } from "./subscriptions.service";
import { CreateSubscriptionDto } from "./subscriptions.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/guards/roles.decorator";

@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private service: SubscriptionsService) {}

  @Get("me")
  @UseGuards(JwtAuthGuard)
  getCurrent(@Request() req: any) {
    return this.service.getCurrent(req.user.sub);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  subscribe(@Request() req: any, @Body() dto: CreateSubscriptionDto) {
    return this.service.subscribe(req.user.sub, dto.plan, dto.interval);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  cancel(@Request() req: any) {
    return this.service.cancel(req.user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  findAll() {
    return this.service.findAll();
  }

  @Get("stats")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  stats() {
    return this.service.stats();
  }
}
