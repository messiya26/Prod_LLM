import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { CreateCourseDto, UpdateCourseDto } from "./dto/course.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/guards/roles.decorator";
import { Public } from "../auth/guards/public.decorator";

@Controller("courses")
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Public()
  @Get()
  findAll(@Query("published") published?: string) {
    const pub = published === "true" ? true : published === "false" ? false : undefined;
    return this.coursesService.findAll(pub);
  }

  @Public()
  @Get("categories")
  getCategories() {
    return this.coursesService.getCategories();
  }

  @Public()
  @Get("instructors")
  getInstructors() {
    return this.coursesService.getInstructors();
  }

  @Public()
  @Get(":slug")
  findBySlug(@Param("slug") slug: string) {
    return this.coursesService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "INSTRUCTOR")
  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "INSTRUCTOR")
  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Put(":id/toggle-publish")
  togglePublish(@Param("id") id: string) {
    return this.coursesService.togglePublish(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.coursesService.delete(id);
  }
}
