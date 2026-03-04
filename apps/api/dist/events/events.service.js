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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EventsService = class EventsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(authorId, data) {
        const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        return this.prisma.event.create({
            data: { ...data, slug, date: new Date(data.date), endDate: data.endDate ? new Date(data.endDate) : undefined, authorId },
            include: { author: { select: { firstName: true, lastName: true } } },
        });
    }
    async findAll(publishedOnly = false) {
        return this.prisma.event.findMany({
            where: publishedOnly ? { published: true } : {},
            orderBy: { date: "asc" },
            include: { author: { select: { firstName: true, lastName: true } } },
        });
    }
    async findBySlug(slug) {
        return this.prisma.event.findUnique({ where: { slug }, include: { author: { select: { firstName: true, lastName: true } } } });
    }
    async update(id, data) {
        if (data.date)
            data.date = new Date(data.date);
        if (data.endDate)
            data.endDate = new Date(data.endDate);
        return this.prisma.event.update({ where: { id }, data, include: { author: { select: { firstName: true, lastName: true } } } });
    }
    async register(id) {
        return this.prisma.event.update({ where: { id }, data: { registrations: { increment: 1 } } });
    }
    async delete(id) {
        return this.prisma.event.delete({ where: { id } });
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map