import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma";

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async findByCourse(courseId: string) {
    return this.prisma.module.findMany({
      where: { courseId },
      include: { lessons: { orderBy: { order: "asc" } } },
      orderBy: { order: "asc" },
    });
  }

  async createModule(courseId: string, dto: { title: string }) {
    const count = await this.prisma.module.count({ where: { courseId } });
    return this.prisma.module.create({
      data: { title: dto.title, order: count + 1, courseId },
      include: { lessons: true },
    });
  }

  async updateModule(id: string, dto: { title?: string; order?: number }) {
    return this.prisma.module.update({
      where: { id },
      data: dto,
      include: { lessons: { orderBy: { order: "asc" } } },
    });
  }

  async deleteModule(id: string) {
    await this.prisma.module.delete({ where: { id } });
    return { deleted: true };
  }

  async createLesson(moduleId: string, dto: { title: string; content?: string; duration?: number }) {
    const count = await this.prisma.lesson.count({ where: { moduleId } });
    return this.prisma.lesson.create({
      data: {
        title: dto.title,
        content: dto.content,
        duration: dto.duration,
        order: count + 1,
        moduleId,
      },
    });
  }

  async updateLesson(id: string, dto: { title?: string; content?: string; duration?: number; order?: number }) {
    return this.prisma.lesson.update({ where: { id }, data: dto });
  }

  async deleteLesson(id: string) {
    await this.prisma.lesson.delete({ where: { id } });
    return { deleted: true };
  }
}
