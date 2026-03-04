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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../prisma");
function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
let CoursesService = class CoursesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(published) {
        return this.prisma.course.findMany({
            where: published !== undefined ? { published } : {},
            include: { category: true, instructor: { select: { id: true, firstName: true, lastName: true, avatar: true, bio: true } }, _count: { select: { modules: true, enrollments: true } } },
            orderBy: { createdAt: "desc" },
        });
    }
    async findBySlug(slug) {
        const course = await this.prisma.course.findUnique({
            where: { slug },
            include: {
                category: true,
                instructor: { select: { id: true, firstName: true, lastName: true, avatar: true, bio: true } },
                modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } },
                _count: { select: { enrollments: true } },
            },
        });
        if (!course)
            throw new common_1.NotFoundException("Formation introuvable");
        return course;
    }
    async create(dto) {
        const slug = slugify(dto.title);
        return this.prisma.course.create({
            data: {
                title: dto.title,
                slug,
                description: dto.description,
                thumbnail: dto.thumbnail,
                level: dto.level || "ALL_LEVELS",
                price: dto.price || 0,
                categoryId: dto.categoryId,
                instructorId: dto.instructorId,
            },
            include: { category: true, instructor: { select: { id: true, firstName: true, lastName: true } } },
        });
    }
    async update(id, dto) {
        return this.prisma.course.update({
            where: { id },
            data: {
                ...dto,
                level: dto.level,
                slug: dto.title ? slugify(dto.title) : undefined,
            },
        });
    }
    async delete(id) {
        await this.prisma.course.delete({ where: { id } });
        return { deleted: true };
    }
    async getCategories() {
        return this.prisma.category.findMany({ include: { _count: { select: { courses: true } } } });
    }
    async getInstructors() {
        return this.prisma.user.findMany({
            where: { role: { in: ["INSTRUCTOR", "ADMIN"] } },
            select: { id: true, firstName: true, lastName: true, email: true, avatar: true, bio: true, role: true, _count: { select: { courses: true } } },
            orderBy: { firstName: "asc" },
        });
    }
    async togglePublish(id) {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course)
            throw new common_1.NotFoundException("Formation introuvable");
        return this.prisma.course.update({ where: { id }, data: { published: !course.published } });
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map