"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityController = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("./audit.service");
const security_settings_service_1 = require("./security-settings.service");
const sessions_service_1 = require("./sessions.service");
const gdpr_service_1 = require("./gdpr.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/guards/roles.decorator");
let SecurityController = class SecurityController {
    constructor(audit, settings, sessions, gdpr) {
        this.audit = audit;
        this.settings = settings;
        this.sessions = sessions;
        this.gdpr = gdpr;
    }
    getAuditLogs(query) {
        return this.audit.findAll(query);
    }
    getAuditStats() {
        return this.audit.getStats();
    }
    getSettings() {
        return this.settings.get();
    }
    async updateSettings(body, req) {
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
    getMySessions(req) {
        return this.sessions.findByUser(req.user.id);
    }
    getUserSessions(userId) {
        return this.sessions.findByUser(userId);
    }
    async revokeSession(id, req) {
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
    async revokeAllSessions(req) {
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
    exportMyData(req) {
        return this.gdpr.exportUserData(req.user.id);
    }
    async requestExport(req) {
        await this.audit.log({
            userId: req.user.id,
            action: "DATA_EXPORT",
            ip: req.ip,
            userAgent: req.headers?.["user-agent"],
        });
        return this.gdpr.createExportRequest(req.user.id);
    }
    async requestDelete(req) {
        await this.audit.log({
            userId: req.user.id,
            action: "DATA_DELETE_REQUEST",
            ip: req.ip,
            userAgent: req.headers?.["user-agent"],
            severity: "WARN",
        });
        return this.gdpr.createDeleteRequest(req.user.id);
    }
    listGdprRequests(query) {
        return this.gdpr.listRequests(query);
    }
    async processGdprRequest(id, body, req) {
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
};
exports.SecurityController = SecurityController;
__decorate([
    (0, common_1.Get)("audit"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "SUPER_ADMIN"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SecurityController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Get)("audit/stats"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "SUPER_ADMIN"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SecurityController.prototype, "getAuditStats", null);
__decorate([
    (0, common_1.Get)("settings"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "SUPER_ADMIN"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SecurityController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Put)("settings"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("SUPER_ADMIN"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Get)("sessions"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SecurityController.prototype, "getMySessions", null);
__decorate([
    (0, common_1.Get)("sessions/user/:userId"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "SUPER_ADMIN"),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SecurityController.prototype, "getUserSessions", null);
__decorate([
    (0, common_1.Delete)("sessions/:id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "revokeSession", null);
__decorate([
    (0, common_1.Delete)("sessions"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "revokeAllSessions", null);
__decorate([
    (0, common_1.Get)("gdpr/my-data"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SecurityController.prototype, "exportMyData", null);
__decorate([
    (0, common_1.Post)("gdpr/export-request"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "requestExport", null);
__decorate([
    (0, common_1.Post)("gdpr/delete-request"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "requestDelete", null);
__decorate([
    (0, common_1.Get)("gdpr/requests"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "SUPER_ADMIN"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SecurityController.prototype, "listGdprRequests", null);
__decorate([
    (0, common_1.Put)("gdpr/requests/:id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("SUPER_ADMIN"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityController.prototype, "processGdprRequest", null);
exports.SecurityController = SecurityController = __decorate([
    (0, common_1.Controller)("security"),
    __metadata("design:paramtypes", [audit_service_1.AuditService,
        security_settings_service_1.SecuritySettingsService,
        sessions_service_1.SessionsService,
        gdpr_service_1.GdprService])
], SecurityController);
//# sourceMappingURL=security.controller.js.map