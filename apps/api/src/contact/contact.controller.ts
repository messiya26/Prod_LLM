import { Controller, Post, Get, Put, Param, Body, Query, UseGuards } from "@nestjs/common";
import { ContactService } from "./contact.service";
import { CreateContactDto } from "./dto/contact.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/guards/roles.decorator";
import { Public } from "../auth/guards/public.decorator";

@Controller("contact")
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateContactDto) {
    return this.contactService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get()
  findAll(@Query("page") page?: string, @Query("limit") limit?: string) {
    return this.contactService.findAll(Number(page) || 1, Number(limit) || 20);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Put(":id/read")
  markAsRead(@Param("id") id: string) {
    return this.contactService.markAsRead(id);
  }
}
