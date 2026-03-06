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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
let BookingsService = class BookingsService {
    constructor(prisma, mail) {
        this.prisma = prisma;
        this.mail = mail;
    }
    async create(dto) {
        const start = new Date(dto.date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(dto.date);
        end.setHours(23, 59, 59, 999);
        const existing = await this.prisma.booking.findFirst({
            where: { date: { gte: start, lte: end }, slot: dto.slot, status: { not: "cancelled" } },
        });
        if (existing) {
            throw new common_1.ConflictException("Ce creneau est deja reserve. Veuillez en choisir un autre.");
        }
        const booking = await this.prisma.booking.create({
            data: { ...dto, date: new Date(dto.date) },
        });
        this.mail.sendBookingConfirmation(dto.email, dto.name, dto.date, dto.slot, dto.subject).catch(() => { });
        return booking;
    }
    findAll() {
        return this.prisma.booking.findMany({
            include: { user: { select: { id: true, firstName: true, lastName: true } } },
            orderBy: { date: "asc" },
        });
    }
    findByDate(date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        return this.prisma.booking.findMany({
            where: { date: { gte: start, lte: end } },
            orderBy: { slot: "asc" },
        });
    }
    getAvailableSlots(date) {
        const allSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        return this.prisma.booking.findMany({
            where: { date: { gte: start, lte: end }, status: { not: "cancelled" } },
        }).then(booked => {
            const taken = booked.map(b => b.slot);
            return allSlots.filter(s => !taken.includes(s));
        });
    }
    updateStatus(id, status) {
        return this.prisma.booking.update({ where: { id }, data: { status } });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, mail_service_1.MailService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map