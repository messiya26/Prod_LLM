import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { BlogService } from "./blog.service";

@Controller("blog")
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findAll() { return this.blogService.findAll(true); }

  @Get("admin")
  @UseGuards(JwtAuthGuard)
  findAllAdmin() { return this.blogService.findAll(false); }

  @Get(":slug")
  findBySlug(@Param("slug") slug: string) { return this.blogService.findBySlug(slug); }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: any, @Body() body: any) { return this.blogService.create(req.user.id, body); }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  update(@Param("id") id: string, @Body() body: any) { return this.blogService.update(id, body); }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  delete(@Param("id") id: string) { return this.blogService.delete(id); }
}
