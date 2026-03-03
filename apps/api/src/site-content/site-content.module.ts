import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma";
import { SiteContentController } from "./site-content.controller";
import { SiteContentService } from "./site-content.service";

@Module({ imports: [PrismaModule], controllers: [SiteContentController], providers: [SiteContentService], exports: [SiteContentService] })
export class SiteContentModule {}
