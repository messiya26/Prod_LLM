import { Controller, Post, Get, Put, Body, Param, UseGuards, Req } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { PaymentGatewayService } from "./payment-gateway.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/guards/roles.decorator";

@Controller("payments")
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
    private gatewayService: PaymentGatewayService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() dto: { courseId: string; amount: number; method: string; metadata?: string }) {
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("INSTRUCTOR", "ADMIN")
  @Get("instructor/stats")
  instructorStats(@Req() req: any) {
    return this.paymentsService.instructorStats(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("INSTRUCTOR", "ADMIN")
  @Get("instructor/students")
  instructorStudents(@Req() req: any) {
    return this.paymentsService.instructorStudents(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get("user/:userId")
  findByUserId(@Param("userId") userId: string) {
    return this.paymentsService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get("gateways")
  getGateways() {
    return this.gatewayService.findAll();
  }

  @Get("gateways/public")
  getPublicGateways() {
    return this.gatewayService.getPublicGateways();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get("gateways/:code/fields")
  getGatewayFields(@Param("code") code: string) {
    return this.gatewayService.getConfigFields(code);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Put("gateways/:id")
  updateGateway(@Param("id") id: string, @Body() data: { enabled?: boolean; sandboxMode?: boolean; config?: any }) {
    return this.gatewayService.update(id, data);
  }
}
