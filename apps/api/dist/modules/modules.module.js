"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModulesModule = void 0;
const common_1 = require("@nestjs/common");
const modules_controller_1 = require("./modules.controller");
const modules_service_1 = require("./modules.service");
const prisma_1 = require("../prisma");
let CourseModulesModule = class CourseModulesModule {
};
exports.CourseModulesModule = CourseModulesModule;
exports.CourseModulesModule = CourseModulesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_1.PrismaModule],
        controllers: [modules_controller_1.ModulesController],
        providers: [modules_service_1.ModulesService],
        exports: [modules_service_1.ModulesService],
    })
], CourseModulesModule);
//# sourceMappingURL=modules.module.js.map