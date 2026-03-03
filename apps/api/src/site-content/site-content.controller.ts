import { Controller, Get, Put, Body, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { SiteContentService } from "./site-content.service";

@Controller("site-content")
export class SiteContentController {
  constructor(private readonly siteContentService: SiteContentService) {}

  @Get()
  getAll() { return this.siteContentService.getAll(); }

  @Get(":key")
  get(@Param("key") key: string) { return this.siteContentService.get(key); }

  @Put(":key")
  @UseGuards(JwtAuthGuard)
  upsert(@Param("key") key: string, @Body() body: { value: string; type?: string }) {
    return this.siteContentService.upsert(key, body.value, body.type);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  bulkUpsert(@Body() body: { items: { key: string; value: string; type?: string }[] }) {
    return this.siteContentService.bulkUpsert(body.items);
  }
}
