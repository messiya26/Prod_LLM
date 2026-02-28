import { Controller, Get } from "@nestjs/common";
import { Public } from "../auth/guards/public.decorator";

@Controller("health")
export class HealthController {
  @Public()
  @Get()
  check() {
    return { status: "ok", timestamp: new Date().toISOString(), service: "Lord Lombo Academie API" };
  }
}
