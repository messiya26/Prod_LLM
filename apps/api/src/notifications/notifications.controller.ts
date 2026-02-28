import { Controller, Get, Post, Patch, Req, Param, UseGuards } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("notifications")
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findMy(@Req() req: any) {
    return this.notificationsService.findByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("unread-count")
  countUnread(@Req() req: any) {
    return this.notificationsService.countUnread(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/read")
  markRead(@Param("id") id: string) {
    return this.notificationsService.markRead(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("read-all")
  markAllRead(@Req() req: any) {
    return this.notificationsService.markAllRead(req.user.id);
  }
}
