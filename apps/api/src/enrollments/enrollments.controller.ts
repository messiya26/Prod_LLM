import { Controller, Post, Get, Put, Patch, Param, Body, UseGuards, Request } from "@nestjs/common";
import { EnrollmentsService } from "./enrollments.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/guards/roles.decorator";

@Controller("enrollments")
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  @Get("admin/recent")
  @UseGuards(RolesGuard)
  @Roles("ADMIN")
  getRecentEnrollments() {
    return this.enrollmentsService.getRecentEnrollments();
  }

  @Post(":courseId")
  enroll(@Request() req: any, @Param("courseId") courseId: string) {
    return this.enrollmentsService.enroll(req.user.id, courseId);
  }

  @Patch(":slug/activate")
  activate(@Request() req: any, @Param("slug") slug: string) {
    return this.enrollmentsService.activateAfterPayment(req.user.id, slug);
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
