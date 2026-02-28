import { Controller, Post, Get, Body, Param, UseGuards, Req } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/guards/roles.decorator";

@Controller("payments")
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() dto: { courseId: string; amount: number; method: string }) {
    return this.paymentsService.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":reference/confirm")
  confirm(@Param("reference") reference: string) {
    return this.paymentsService.confirm(reference);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get("stats")
  stats() {
    return this.paymentsService.stats();
  }

  @UseGuards(JwtAuthGuard)
  @Get("my")
  findMy(@Req() req: any) {
    return this.paymentsService.findByUser(req.user.id);
  }
}
