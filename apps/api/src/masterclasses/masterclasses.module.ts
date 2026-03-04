import { Module } from "@nestjs/common";
import { MasterclassesController } from "./masterclasses.controller";
import { MasterclassesService } from "./masterclasses.service";
import { PrismaModule } from "../prisma/prisma.module";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [MasterclassesController],
  providers: [MasterclassesService],
  exports: [MasterclassesService],
})
export class MasterclassesModule {}
