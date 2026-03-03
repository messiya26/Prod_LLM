import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ResourcesService } from "./resources.service";
import { CreateResourceDto, CreateQuizDto, CreateQuestionDto, SubmitQuizDto } from "./resources.dto";

@Controller("resources")
export class ResourcesController {
  constructor(private readonly svc: ResourcesService) {}

  // ── Resources ────────────────────────────────────────────────────────────

  @Get("course/:courseId")
  @UseGuards(JwtAuthGuard)
  getCourseResources(@Param("courseId") courseId: string) {
    return this.svc.getCourseResources(courseId);
  }

  @Post("course/:courseId")
  @UseGuards(JwtAuthGuard)
  addResource(@Param("courseId") courseId: string, @Body() dto: CreateResourceDto) {
    return this.svc.addResource(courseId, dto);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  updateResource(@Param("id") id: string, @Body() dto: Partial<CreateResourceDto>) {
    return this.svc.updateResource(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  deleteResource(@Param("id") id: string) {
    return this.svc.deleteResource(id);
  }

  // ── Quiz ─────────────────────────────────────────────────────────────────

  @Get("quiz/course/:courseId")
  @UseGuards(JwtAuthGuard)
  getCourseQuiz(@Param("courseId") courseId: string) {
    return this.svc.getCourseQuiz(courseId);
  }

  @Post("quiz/course/:courseId")
  @UseGuards(JwtAuthGuard)
  createOrUpdateQuiz(@Param("courseId") courseId: string, @Body() dto: CreateQuizDto) {
    return this.svc.createOrUpdateQuiz(courseId, dto);
  }

  @Post("quiz/:quizId/questions")
  @UseGuards(JwtAuthGuard)
  addQuestion(@Param("quizId") quizId: string, @Body() dto: CreateQuestionDto) {
    return this.svc.addQuestion(quizId, dto);
  }

  @Delete("quiz/questions/:id")
  @UseGuards(JwtAuthGuard)
  deleteQuestion(@Param("id") id: string) {
    return this.svc.deleteQuestion(id);
  }

  @Post("quiz/:quizId/submit")
  @UseGuards(JwtAuthGuard)
  submitQuiz(@Param("quizId") quizId: string, @Body() dto: SubmitQuizDto, @Request() req: any) {
    return this.svc.submitQuiz(req.user.id, quizId, dto);
  }

  @Get("quiz/:quizId/attempts")
  @UseGuards(JwtAuthGuard)
  getMyAttempts(@Param("quizId") quizId: string, @Request() req: any) {
    return this.svc.getMyAttempts(req.user.id, quizId);
  }

  // ── Lesson Progress ───────────────────────────────────────────────────────

  @Post("lessons/:lessonId/complete")
  @UseGuards(JwtAuthGuard)
  markComplete(@Param("lessonId") lessonId: string, @Body() body: { enrollmentId: string }, @Request() req: any) {
    return this.svc.markLessonComplete(req.user.id, lessonId, body.enrollmentId);
  }

  @Get("lessons/completed/:enrollmentId")
  @UseGuards(JwtAuthGuard)
  getCompleted(@Param("enrollmentId") enrollmentId: string, @Request() req: any) {
    return this.svc.getCompletedLessons(req.user.id, enrollmentId);
  }
}
