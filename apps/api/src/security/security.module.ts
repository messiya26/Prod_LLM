import { Module, Global } from "@nestjs/common";
import { PrismaModule } from "../prisma";
import { AuditService } from "./audit.service";
import { SecuritySettingsService } from "./security-settings.service";
import { SessionsService } from "./sessions.service";
import { GdprService } from "./gdpr.service";
import { SecurityController } from "./security.controller";

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [SecurityController],
  providers: [AuditService, SecuritySettingsService, SessionsService, GdprService],
  exports: [AuditService, SecuritySettingsService, SessionsService, GdprService],
})
export class SecurityModule {}
