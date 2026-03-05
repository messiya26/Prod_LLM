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
exports.LiveController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/guards/roles.decorator");
const live_service_1 = require("./live.service");
const live_dto_1 = require("./live.dto");
let LiveController = class LiveController {
    constructor(svc) {
        this.svc = svc;
    }
    findAll() {
        return this.svc.findAll();
    }
    findUpcoming() {
        return this.svc.findUpcoming();
    }
    findPast() {
        return this.svc.findPast();
    }
    findMyLive(req) {
        return this.svc.findByHost(req.user.id);
    }
    findById(id) {
        return this.svc.findById(id);
    }
    create(req, dto) {
        return this.svc.create(req.user.id, dto);
    }
    update(id, dto) {
        return this.svc.update(id, dto);
    }
    start(id) {
        return this.svc.start(id);
    }
    end(id) {
        return this.svc.end(id);
    }
    cancel(id) {
        return this.svc.cancel(id);
    }
    delete(id) {
        return this.svc.delete(id);
    }
    join(req, id) {
        return this.svc.join(req.user.id, id);
    }
    leave(req, id) {
        return this.svc.leave(req.user.id, id);
    }
};
exports.LiveController = LiveController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LiveController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("upcoming"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LiveController.prototype, "findUpcoming", null);
__decorate([
    (0, common_1.Get)("past"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LiveController.prototype, "findPast", null);
__decorate([
    (0, common_1.Get)("instructor/my"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("INSTRUCTOR", "ADMIN"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LiveController.prototype, "findMyLive", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LiveController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("INSTRUCTOR", "ADMIN"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, live_dto_1.CreateLiveSessionDto]),
    __metadata("design:returntype", void 0)
], LiveController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("INSTRUCTOR", "ADMIN"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, live_dto_1.UpdateLiveSessionDto]),
    __metadata("design:returntype", void 0)
], LiveController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(":id/start"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("INSTRUCTOR", "ADMIN"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LiveController.prototype, "start", null);
__decorate([
    (0, common_1.Post)(":id/end"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("INSTRUCTOR", "ADMIN"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LiveController.prototype, "end", null);
__decorate([
    (0, common_1.Post)(":id/cancel"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("INSTRUCTOR", "ADMIN"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LiveController.prototype, "cancel", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("INSTRUCTOR", "ADMIN"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LiveController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(":id/join"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LiveController.prototype, "join", null);
__decorate([
    (0, common_1.Post)(":id/leave"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LiveController.prototype, "leave", null);
exports.LiveController = LiveController = __decorate([
    (0, common_1.Controller)("live"),
    __metadata("design:paramtypes", [live_service_1.LiveService])
], LiveController);
//# sourceMappingURL=live.controller.js.map