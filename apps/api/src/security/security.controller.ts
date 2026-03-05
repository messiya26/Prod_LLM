import { Controller, Get, Post, Put, Delete, Body, Query, Param, Req, UseGuards, HttpCode } from "@nestjs/common";
import { AuditService } from "./audit.service";
import { SecuritySettingsService } from "./security-settings.service";
import { SessionsService } from "./sessions.service";
import { GdprService } from "./gdpr.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/guards/roles.decorator";

@Controller("security")
export class SecurityController {
  constructor(
    private audit: AuditService,
    private settings: SecuritySettingsService,
    private sessions: SessionsService,
    private gdpr: GdprService,
  ) {}

  // ---- AUDIT LOGS ----
  @Get("audit")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "SUPER_ADMIN")
  getAuditLogs(@Query() query: any) {
    return this.audit.findAll(query);
  }

  @Get("audit/stats")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "SUPER_ADMIN")
  getAuditStats() {
    return this.audit.getStats();
  }

  // ---- SECURITY SETTINGS ----
  @Get("settings")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "SUPER_ADMIN")
  getSettings() {
    return this.settings.get();
  }

  @Put("settings")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  async updateSettings(@Body() body: any, @Req() req: any) {
    const result = await this.settings.update(body);
    await this.audit.log({
      userId: req.user?.id,
      action: "SETTINGS_UPDATE",
      metadata: body,
      ip: req.ip,
      userAgent: req.headers?.["user-agent"],
    });
    return result;
  }

  // ---- SESSIONS ----
  @Get("sessions")
  @UseGuards(JwtAuthGuard)
  getMySessions(@Req() req: any) {
    return this.sessions.findByUser(req.user.id);
  }

  @Get("sessions/user/:userId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "SUPER_ADMIN")
  getUserSessions(@Param("userId") userId: string) {
    return this.sessions.findByUser(userId);
  }

  @Delete("sessions/:id")
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async revokeSession(@Param("id") id: string, @Req() req: any) {
    await this.sessions.revoke(id, req.user.id);
    await this.audit.log({
      userId: req.user.id,
      action: "SESSION_REVOKE",
      targetId: id,
      targetType: "UserSession",
      ip: req.ip,
      userAgent: req.headers?.["user-agent"],
    });
    return { message: "Session révoquée" };
  }

  @Delete("sessions")
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async revokeAllSessions(@Req() req: any) {
    await this.sessions.revokeAll(req.user.id);
    await this.audit.log({
      userId: req.user.id,
      action: "SESSION_REVOKE",
      metadata: { all: true },
      ip: req.ip,
      userAgent: req.headers?.["user-agent"],
    });
    return { message: "Toutes les sessions révoquées" };
  }

  // ---- RGPD ----
  @Get("gdpr/my-data")
  @UseGuards(JwtAuthGuard)
  exportMyData(@Req() req: any) {
    return this.gdpr.exportUserData(req.user.id);
  }

  @Post("gdpr/export-request")
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async requestExport(@Req() req: any) {
    await this.audit.log({
      userId: req.user.id,
      action: "DATA_EXPORT",
      ip: req.ip,
      userAgent: req.headers?.["user-agent"],
    });
    return this.gdpr.createExportRequest(req.user.id);
  }

  @Post("gdpr/delete-request")
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async requestDelete(@Req() req: any) {
    await this.audit.log({
      userId: req.user.id,
      action: "DATA_DELETE_REQUEST",
      ip: req.ip,
      userAgent: req.headers?.["user-agent"],
      severity: "WARN",
    });
    return this.gdpr.createDeleteRequest(req.user.id);
  }

  @Get("gdpr/requests")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "SUPER_ADMIN")
  listGdprRequests(@Query() query: any) {
    return this.gdpr.listRequests(query);
  }

  @Put("gdpr/requests/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN")
  async processGdprRequest(@Param("id") id: string, @Body() body: { status: "APPROVED" | "REJECTED" }, @Req() req: any) {
    const result = await this.gdpr.processRequest(id, req.user.id, body.status);
    await this.audit.log({
      userId: req.user.id,
      action: "DATA_DELETE_REQUEST",
      targetId: id,
      targetType: "GdprRequest",
      metadata: { status: body.status },
      ip: req.ip,
      userAgent: req.headers?.["user-agent"],
      severity: "CRITICAL",
    });
    return result;
  }
}
