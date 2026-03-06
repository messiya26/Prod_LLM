import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { PaymentGatewayService } from "./payment-gateway.service";
import { PrismaModule } from "../prisma/prisma.module";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentGatewayService],
  exports: [PaymentsService, PaymentGatewayService],
})
export class PaymentsModule {}
