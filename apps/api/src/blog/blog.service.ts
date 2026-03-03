import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async create(authorId: string, data: { title: string; slug?: string; excerpt?: string; content: string; image?: string; category?: string; tags?: string; published?: boolean }) {
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return this.prisma.blogPost.create({ data: { ...data, slug, authorId }, include: { author: { select: { firstName: true, lastName: true } } } });
  }

  async findAll(publishedOnly = false) {
    return this.prisma.blogPost.findMany({
      where: publishedOnly ? { published: true } : {},
      orderBy: { createdAt: "desc" },
      include: { author: { select: { firstName: true, lastName: true } } },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.blogPost.findUnique({ where: { slug }, include: { author: { select: { firstName: true, lastName: true } } } });
  }

  async update(id: string, data: Partial<{ title: string; slug: string; excerpt: string; content: string; image: string; category: string; tags: string; published: boolean }>) {
    return this.prisma.blogPost.update({ where: { id }, data, include: { author: { select: { firstName: true, lastName: true } } } });
  }

  async delete(id: string) {
    return this.prisma.blogPost.delete({ where: { id } });
  }
}
