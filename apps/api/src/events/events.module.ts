import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";

@Module({ imports: [PrismaModule], controllers: [EventsController], providers: [EventsService] })
export class EventsModule {}
