import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SiteContentService {
  constructor(private prisma: PrismaService) {}

  async get(key: string) {
    return this.prisma.siteContent.findUnique({ where: { key } });
  }

  async getAll() {
    return this.prisma.siteContent.findMany();
  }

  async upsert(key: string, value: string, type = "text") {
    return this.prisma.siteContent.upsert({
      where: { key },
      create: { key, value, type },
      update: { value, type },
    });
  }

  async bulkUpsert(items: { key: string; value: string; type?: string }[]) {
    return Promise.all(items.map(i => this.upsert(i.key, i.value, i.type || "text")));
  }
}
