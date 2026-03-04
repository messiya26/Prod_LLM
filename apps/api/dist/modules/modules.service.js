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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../prisma");
let ModulesService = class ModulesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByCourse(courseId) {
        return this.prisma.module.findMany({
            where: { courseId },
            include: { lessons: { orderBy: { order: "asc" } } },
            orderBy: { order: "asc" },
        });
    }
    async createModule(courseId, dto) {
        const count = await this.prisma.module.count({ where: { courseId } });
        return this.prisma.module.create({
            data: { title: dto.title, order: count + 1, courseId },
            include: { lessons: true },
        });
    }
    async updateModule(id, dto) {
        return this.prisma.module.update({
            where: { id },
            data: dto,
            include: { lessons: { orderBy: { order: "asc" } } },
        });
    }
    async deleteModule(id) {
        await this.prisma.module.delete({ where: { id } });
        return { deleted: true };
    }
    async createLesson(moduleId, dto) {
        const count = await this.prisma.lesson.count({ where: { moduleId } });
        return this.prisma.lesson.create({
            data: {
                title: dto.title,
                content: dto.content,
                duration: dto.duration,
                order: count + 1,
                moduleId,
            },
        });
    }
    async updateLesson(id, dto) {
        return this.prisma.lesson.update({ where: { id }, data: dto });
    }
    async deleteLesson(id) {
        await this.prisma.lesson.delete({ where: { id } });
        return { deleted: true };
    }
};
exports.ModulesService = ModulesService;
exports.ModulesService = ModulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], ModulesService);
//# sourceMappingURL=modules.service.js.map