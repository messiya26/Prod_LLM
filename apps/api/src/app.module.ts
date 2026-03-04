import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { PrismaModule } from "./prisma";
import { MailModule } from "./mail/mail.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { CoursesModule } from "./courses/courses.module";
import { EnrollmentsModule } from "./enrollments/enrollments.module";
import { ContactModule } from "./contact/contact.module";
import { HealthModule } from "./health/health.module";
import { PaymentsModule } from "./payments/payments.module";
import { BookingsModule } from "./bookings/bookings.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { CertificatesModule } from "./certificates/certificates.module";
import { ResourcesModule } from "./resources/resources.module";
import { LiveModule } from "./live/live.module";
import { InvitationsModule } from "./invitations/invitations.module";
import { UploadModule } from "./upload/upload.module";
import { BlogModule } from "./blog/blog.module";
import { EventsModule } from "./events/events.module";
import { SiteContentModule } from "./site-content/site-content.module";
import { CourseModulesModule } from "./modules/modules.module";
import { SubscriptionsModule } from "./subscriptions/subscriptions.module";
import { MasterclassesModule } from "./masterclasses/masterclasses.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    MailModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    EnrollmentsModule,
    ContactModule,
    HealthModule,
    PaymentsModule,
    BookingsModule,
    NotificationsModule,
    CertificatesModule,
    ResourcesModule,
    LiveModule,
    InvitationsModule,
    UploadModule,
    BlogModule,
    EventsModule,
    SiteContentModule,
    CourseModulesModule,
    SubscriptionsModule,
    MasterclassesModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
