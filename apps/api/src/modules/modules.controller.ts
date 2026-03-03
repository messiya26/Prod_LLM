import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from "@nestjs/common";
import { ModulesService } from "./modules.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/guards/roles.decorator";
import { Public } from "../auth/guards/public.decorator";

@Controller("modules")
export class ModulesController {
  constructor(private modulesService: ModulesService) {}

  @Public()
  @Get("course/:courseId")
  findByCourse(@Param("courseId") courseId: string) {
    return this.modulesService.findByCourse(courseId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "INSTRUCTOR")
  @Post("course/:courseId")
  createModule(@Param("courseId") courseId: string, @Body() dto: { title: string }) {
    return this.modulesService.createModule(courseId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "INSTRUCTOR")
  @Put(":id")
  updateModule(@Param("id") id: string, @Body() dto: { title?: string; order?: number }) {
    return this.modulesService.updateModule(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "INSTRUCTOR")
  @Delete(":id")
  deleteModule(@Param("id") id: string) {
    return this.modulesService.deleteModule(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "INSTRUCTOR")
  @Post(":moduleId/lessons")
  createLesson(@Param("moduleId") moduleId: string, @Body() dto: { title: string; content?: string; duration?: number }) {
    return this.modulesService.createLesson(moduleId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "INSTRUCTOR")
  @Put("lessons/:id")
  updateLesson(@Param("id") id: string, @Body() dto: { title?: string; content?: string; duration?: number; order?: number }) {
    return this.modulesService.updateLesson(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "INSTRUCTOR")
  @Delete("lessons/:id")
  deleteLesson(@Param("id") id: string) {
    return this.modulesService.deleteLesson(id);
  }
}
