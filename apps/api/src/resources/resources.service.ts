import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma";
import { CreateResourceDto, CreateQuizDto, CreateQuestionDto, SubmitQuizDto } from "./resources.dto";

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  // ── Resources ────────────────────────────────────────────────────────────

  async getCourseResources(courseId: string) {
    return this.prisma.courseResource.findMany({
      where: { courseId },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  }

  async addResource(courseId: string, dto: CreateResourceDto) {
    return this.prisma.courseResource.create({
      data: { ...dto, courseId },
    });
  }

  async updateResource(id: string, dto: Partial<CreateResourceDto>) {
    return this.prisma.courseResource.update({ where: { id }, data: dto });
  }

  async deleteResource(id: string) {
    await this.prisma.courseResource.delete({ where: { id } });
    return { deleted: true };
  }

  // ── Quiz ─────────────────────────────────────────────────────────────────

  async getCourseQuiz(courseId: string) {
    return this.prisma.quiz.findUnique({
      where: { courseId },
      include: { questions: { orderBy: { order: "asc" } } },
    });
  }

  async createOrUpdateQuiz(courseId: string, dto: CreateQuizDto) {
    return this.prisma.quiz.upsert({
      where: { courseId },
      create: { ...dto, courseId, passingScore: dto.passingScore ?? 70 },
      update: { ...dto },
    });
  }

  async addQuestion(quizId: string, dto: CreateQuestionDto) {
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

  async deleteQuestion(id: string) {
    await this.prisma.quizQuestion.delete({ where: { id } });
    return { deleted: true };
  }

  async submitQuiz(userId: string, quizId: string, dto: SubmitQuizDto) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });
    if (!quiz) throw new NotFoundException("Quiz introuvable");

    let correct = 0;
    for (const ans of dto.answers) {
      const q = quiz.questions.find((q: { id: string; correctAnswer: string }) => q.id === ans.questionId);
      if (q && q.correctAnswer === ans.answer) correct++;
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

  async getMyAttempts(userId: string, quizId: string) {
    return this.prisma.quizAttempt.findMany({
      where: { userId, quizId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  }

  // ── Lesson Progress ───────────────────────────────────────────────────────

  async markLessonComplete(userId: string, lessonId: string, enrollmentId: string) {
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

  async getCompletedLessons(userId: string, enrollmentId: string) {
    const rows = await this.prisma.lessonProgress.findMany({
      where: { userId, enrollmentId, completed: true },
      select: { lessonId: true },
    });
    return rows.map((r: { lessonId: string }) => r.lessonId);
  }
}
