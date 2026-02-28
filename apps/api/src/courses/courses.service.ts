import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma";
import { CreateCourseDto, UpdateCourseDto } from "./dto/course.dto";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  findAll(published?: boolean) {
    return this.prisma.course.findMany({
      where: published !== undefined ? { published } : {},
      include: { category: true, instructor: { select: { id: true, firstName: true, lastName: true, avatar: true, bio: true } }, _count: { select: { modules: true, enrollments: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async findBySlug(slug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        category: true,
        instructor: { select: { id: true, firstName: true, lastName: true, avatar: true, bio: true } },
        modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } },
        _count: { select: { enrollments: true } },
      },
    });
    if (!course) throw new NotFoundException("Formation introuvable");
    return course;
  }

  async create(dto: CreateCourseDto) {
    const slug = slugify(dto.title);
    return this.prisma.course.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        thumbnail: dto.thumbnail,
        level: dto.level as any || "ALL_LEVELS",
        price: dto.price || 0,
        categoryId: dto.categoryId,
        instructorId: dto.instructorId,
      },
      include: { category: true, instructor: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async update(id: string, dto: UpdateCourseDto) {
    return this.prisma.course.update({
      where: { id },
      data: {
        ...dto,
        level: dto.level as any,
        slug: dto.title ? slugify(dto.title) : undefined,
      },
    });
  }

  async delete(id: string) {
    await this.prisma.course.delete({ where: { id } });
    return { deleted: true };
  }

  async getCategories() {
    return this.prisma.category.findMany({ include: { _count: { select: { courses: true } } } });
  }

  async getInstructors() {
    return this.prisma.user.findMany({
      where: { role: { in: ["INSTRUCTOR", "ADMIN"] } },
      select: { id: true, firstName: true, lastName: true, email: true, avatar: true, bio: true, role: true, _count: { select: { courses: true } } },
      orderBy: { firstName: "asc" },
    });
  }

  async togglePublish(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException("Formation introuvable");
    return this.prisma.course.update({ where: { id }, data: { published: !course.published } });
  }
}
