import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma";
import { CreateContactDto } from "./dto/contact.dto";

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateContactDto) {
    return this.prisma.contactMessage.create({ data: dto });
  }

  findAll(page = 1, limit = 20) {
    return this.prisma.contactMessage.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  markAsRead(id: string) {
    return this.prisma.contactMessage.update({ where: { id }, data: { read: true } });
  }
}
