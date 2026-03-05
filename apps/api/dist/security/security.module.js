"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../prisma");
const audit_service_1 = require("./audit.service");
const security_settings_service_1 = require("./security-settings.service");
const sessions_service_1 = require("./sessions.service");
const gdpr_service_1 = require("./gdpr.service");
const security_controller_1 = require("./security.controller");
let SecurityModule = class SecurityModule {
};
exports.SecurityModule = SecurityModule;
exports.SecurityModule = SecurityModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [prisma_1.PrismaModule],
        controllers: [security_controller_1.SecurityController],
        providers: [audit_service_1.AuditService, security_settings_service_1.SecuritySettingsService, sessions_service_1.SessionsService, gdpr_service_1.GdprService],
        exports: [audit_service_1.AuditService, security_settings_service_1.SecuritySettingsService, sessions_service_1.SessionsService, gdpr_service_1.GdprService],
    })
], SecurityModule);
//# sourceMappingURL=security.module.js.map