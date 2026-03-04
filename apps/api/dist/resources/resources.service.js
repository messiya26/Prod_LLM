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
exports.ResourcesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../prisma");
let ResourcesService = class ResourcesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCourseResources(courseId) {
        return this.prisma.courseResource.findMany({
            where: { courseId },
            orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        });
    }
    async addResource(courseId, dto) {
        return this.prisma.courseResource.create({
            data: { ...dto, courseId },
        });
    }
    async updateResource(id, dto) {
        return this.prisma.courseResource.update({ where: { id }, data: dto });
    }
    async deleteResource(id) {
        await this.prisma.courseResource.delete({ where: { id } });
        return { deleted: true };
    }
    async getCourseQuiz(courseId) {
        return this.prisma.quiz.findUnique({
            where: { courseId },
            include: { questions: { orderBy: { order: "asc" } } },
        });
    }
    async createOrUpdateQuiz(courseId, dto) {
        return this.prisma.quiz.upsert({
            where: { courseId },
            create: { ...dto, courseId, passingScore: dto.passingScore ?? 70 },
            update: { ...dto },
        });
    }
    async addQuestion(quizId, dto) {
        return this.prisma.quizQuestion.create({
            data: {
                quizId,
                question: dto.question,
                options: JSON.stringify(dto.options),
                correctAnswer: dto.correctAnswer,
                explanation: dto.explanation,
                order: dto.order ?? 0,
            },
        });
    }
    async deleteQuestion(id) {
        await this.prisma.quizQuestion.delete({ where: { id } });
        return { deleted: true };
    }
    async submitQuiz(userId, quizId, dto) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id: quizId },
            include: { questions: true },
        });
        if (!quiz)
            throw new common_1.NotFoundException("Quiz introuvable");
        let correct = 0;
        for (const ans of dto.answers) {
            const q = quiz.questions.find((q) => q.id === ans.questionId);
            if (q && q.correctAnswer === ans.answer)
                correct++;
        }
        const score = quiz.questions.length > 0
            ? Math.round((correct / quiz.questions.length) * 100)
            : 0;
        const passed = score >= quiz.passingScore;
        const attempt = await this.prisma.quizAttempt.create({
            data: {
                userId,
                quizId,
                answers: JSON.stringify(dto.answers),
                score,
                passed,
            },
        });
        return { score, passed, correct, total: quiz.questions.length, attempt };
    }
    async getMyAttempts(userId, quizId) {
        return this.prisma.quizAttempt.findMany({
            where: { userId, quizId },
            orderBy: { createdAt: "desc" },
            take: 5,
        });
    }
    async markLessonComplete(userId, lessonId, enrollmentId) {
        const progress = await this.prisma.lessonProgress.upsert({
            where: { userId_lessonId: { userId, lessonId } },
            create: { userId, lessonId, enrollmentId, completed: true },
            update: { completed: true, watchedAt: new Date() },
        });
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { id: enrollmentId },
            include: { course: { include: { modules: { include: { lessons: true } } } } },
        });
        if (enrollment) {
            const allLessons = enrollment.course.modules.flatMap((m) => m.lessons);
            const completedCount = await this.prisma.lessonProgress.count({
                where: { enrollmentId, completed: true },
            });
            const pct = Math.round((completedCount / allLessons.length) * 100);
            await this.prisma.enrollment.update({
                where: { id: enrollmentId },
                data: { progress: pct, status: pct >= 100 ? "COMPLETED" : "ACTIVE" },
            });
        }
        return progress;
    }
    async getCompletedLessons(userId, enrollmentId) {
        const rows = await this.prisma.lessonProgress.findMany({
            where: { userId, enrollmentId, completed: true },
            select: { lessonId: true },
        });
        return rows.map((r) => r.lessonId);
    }
};
exports.ResourcesService = ResourcesService;
exports.ResourcesService = ResourcesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], ResourcesService);
//# sourceMappingURL=resources.service.js.map