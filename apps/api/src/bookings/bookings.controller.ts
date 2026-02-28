import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/guards/roles.decorator";
import { Public } from "../auth/guards/public.decorator";

@Controller("bookings")
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Public()
  @Post()
  create(@Body() dto: { name: string; email: string; phone?: string; date: string; slot: string; subject: string; notes?: string }) {
    return this.bookingsService.create(dto);
  }

  @Public()
  @Get("available-slots")
  getAvailableSlots(@Query("date") date: string) {
    return this.bookingsService.getAvailableSlots(date);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body() dto: { status: string }) {
    return this.bookingsService.updateStatus(id, dto.status);
  }
}
