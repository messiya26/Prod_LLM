import { Controller, Post, Get, Put, Param, Body, UseGuards, Request } from "@nestjs/common";
import { EnrollmentsService } from "./enrollments.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("enrollments")
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  @Post(":courseId")
  enroll(@Request() req: any, @Param("courseId") courseId: string) {
    return this.enrollmentsService.enroll(req.user.id, courseId);
  }

  @Get("check/:slug")
  checkEnrolled(@Request() req: any, @Param("slug") slug: string) {
    return this.enrollmentsService.checkEnrolled(req.user.id, slug);
  }

  @Get()
  getMyEnrollments(@Request() req: any) {
    return this.enrollmentsService.getMyEnrollments(req.user.id);
  }

  @Put(":courseId/progress")
  updateProgress(@Request() req: any, @Param("courseId") courseId: string, @Body("progress") progress: number) {
    return this.enrollmentsService.updateProgress(req.user.id, courseId, progress);
  }
}
